# accounts/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serilizaers import UserSerializer,FileSerializer,FolderSerializer,ModelSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User,File,Folder,Model
from django.db import DatabaseError
import re

@api_view(['POST'])
def register_user(request):
    email = request.data.get("email")
    if email:
        try:
            email_exists = User.objects.filter(email=email)
        except DatabaseError:
            return Response({"msg": "Database error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if email_exists:
            return Response({"msg": "This email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response({"msg": "Error occurred", "error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        user = None
        if re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', username):
            try:
                user = User.objects.get(email=username)
            except ObjectDoesNotExist:
                pass

        if not user:
            user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            userInfo={
                "username":user.username,
                "email":user.email,
                "profilePicture":user.profilePicture,
                "about":user.about,
                "type":user.type,
                "id":user.id
            }
            return Response({"msg":"succesfuly logged in",'token': token.key,'data':userInfo}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    print("start")
    if request.method == 'POST':
        try:
            # Delete the user's token to logout
            request.user.auth_token.delete()
            return Response({'msg': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_user(request, pk=None):
    if pk:
        try:
            user = User.objects.get(id=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({'error': 'Error occured, check your connection and try again. if you are accessing individual user, please try with correct ID'}, status=status.HTTP_404_NOT_FOUND)

    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    data = request.data

    serializer = UserSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)


#-----Folder---#


def exrtract_foldername(owner):
       folders = list(Folder.objects.filter(owner=owner))
       owner_all_folders = [folder.foldername for folder in folders]
       return owner_all_folders

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_folder(request):
    
    if request.data["owner"] != str(request.user.id):
        return Response({'error': 'You do not have permission for this access'}, status=status.HTTP_403_FORBIDDEN)
    
    user_exist=User.objects.get(id=request.data["owner"])
    if user_exist:
        owner_all_folders = exrtract_foldername(request.data["owner"])
        
        if request.data["foldername"] in owner_all_folders:
            return Response({"msg":"sorry, this folder is already exist. please use unique folder name"}, status=404)
        
        serializer = FolderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return  Response({"msg":"user not found","error":serializer.errors}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_owner_folders(request, pk=None):
    owner = request.GET.get('owner') or request.data.get('owner')

    if not owner:
        return Response({'error': 'Please provide the owner parameter'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if pk:
           
            folder = Folder.objects.get(id=pk)
            user = User.objects.get(id=request.user.id)
            print(str(request.user.id)==str(folder.owner.id))
            if str(request.user.id)==str(folder.owner.id):
              folder = Folder.objects.get(owner=request.user.id, id=pk) 
            
            elif user in folder.shared_with.all():
             folder = Folder.objects.get(id=pk,shared_with__in=[str(request.user.id)]) 
            
            else:
               Response({'error': 'Sorry you have no access for this folder'}, status=status.HTTP_404_NOT_FOUND)

            folder_dict = {
                'foldername': folder.foldername,
                'shared_with': list(folder.shared_with.values_list('id', flat=True)),
                'id': folder.id,
                'created_at': folder.created_at,
                'owner':folder.owner.id,
                'owner_email':folder.owner.email,
            }

            return Response(folder_dict, status=status.HTTP_200_OK)
            
        if owner != str(request.user.id):
         return Response({'error': 'You do not have permission for this access'}, status=status.HTTP_403_FORBIDDEN)
        
        folders = Folder.objects.filter(owner=owner)
        folder_list = []
        for folder in folders:
            folder_dict = {
                'foldername': folder.foldername,
                'shared_with': list(folder.shared_with.values_list('id', flat=True)),
                'id': folder.id,
                'created_at': folder.created_at,
                'owner':owner
            }
            folder_list.append(folder_dict)

        return Response(folder_list, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def add_shared_users(request):
    folderID = request.data["folderID"]
    to_share_with = request.data["to_share_with"]

    if not folderID or not to_share_with:
        return Response({'error': 'Please fill all necessary fields'}, status=status.HTTP_400_BAD_REQUEST)

    if to_share_with==str(request.user.email):
        return Response({'error': 'Please you cant share folder for yourelf.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        folder = Folder.objects.get(id=folderID, owner=str(request.user.id))
    except Folder.DoesNotExist:
        return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        remote_user = User.objects.get(email=to_share_with)
        if remote_user in folder.shared_with.all():
           return Response({'error': 'User already added'}, status=status.HTTP_404_NOT_FOUND)

        folder.shared_with.add(remote_user)
        folder.save()
        return Response({'message': 'User added to shared users successfully'}, status=status.HTTP_200_OK)
   
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_shared_users(request):
    owner = str(request.user.id)
    folderID =  request.GET.get('folderID') or request.data.get('folderID')
    try:
        folder = Folder.objects.get(id=folderID, owner=owner)
        shared_users = folder.shared_with.all()
        serialized_users = [{'email': user.email, 'username': user.username} for user in shared_users]
        
        return Response(serialized_users, status=status.HTTP_200_OK)

    except Folder.DoesNotExist:
        return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_shared_folder(request): 
    user = request.user
    shared_folders = user.shared_folders
    serializer = FolderSerializer(shared_folders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def remove_shared_users(request):
    print(request.data)
    folderID = request.data["folderID"]
    user_to_remove = request.data["user_to_remove"]

    if not folderID or not user_to_remove:
        return Response({'error': 'Please fill all necessary fields'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        folder = Folder.objects.get(id=folderID, owner=str(request.user.id))
    except Folder.DoesNotExist:
        return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        remote_user = User.objects.get(email=user_to_remove)
        if remote_user in folder.shared_with.all():
            folder.shared_with.remove(remote_user)
            folder.save()
            return Response({'message': 'User removed from shared users successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User is not in shared users'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_folder(request):
    id = request.data["id"]
    foldername = request.data["foldername"]
    if not id:
        return Response({'error': 'Please provide the folder ID'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        folder = Folder.objects.get(id=id)
    except Folder.DoesNotExist:
        return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'check your internate connection or use valid id'}, status=status.HTTP_404_NOT_FOUND)
  
    owner = folder.owner
    if owner != request.user:
        return Response({'error': 'You do not have permission to delete this folder'}, status=status.HTTP_403_FORBIDDEN)

    
    if folder.foldername != foldername:
         return Response({'error': 'please use correct foldername'}, status=status.HTTP_403_FORBIDDEN)
    
    folder.delete()
    return Response({'message': 'folder successfully deleted'}, status=status.HTTP_200_OK)




#------File----#


from django.utils.encoding import force_bytes

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_files(request):
    folderID = request.data.get("folder")
    ownerID = request.data.get("owner")
    owner = str(request.user.id)

    if not folderID:
        return Response({'error': 'Please provide the folder ID'}, status=status.HTTP_400_BAD_REQUEST)

    if owner != ownerID:
        return Response({'error': 'You can only add files to your own folder'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        folder = Folder.objects.get(id=folderID, owner=owner)
    except Folder.DoesNotExist:
        return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'Check your internet connection or use a valid folder ID'}, status=status.HTTP_404_NOT_FOUND)

    files = request.FILES.getlist('file[]')
    data = []
    canceled_data = []
    for index, file in enumerate(files):
        file_type = request.data.get(f'file_type_{index}')
       
        if file_type == 'unknown' or  file_type is None :
            canceled_data.append({
                'file': file,
                'size': request.data.get(f'size_{index}'),
                'file_type': file_type
            })
            continue  # Skip saving files with unknown file_type

        file_data = {
            'folder': folderID,
            'owner': ownerID,
            'file': file,
            'size': request.data.get(f'size_{index}'),
            'file_type': file_type
        }
        serializer = FileSerializer(data=file_data)
        if serializer.is_valid():
            print("is valid")
            serializer.save()
            data.append(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
   
    encoded_data = [force_bytes(item, encoding='utf-8') for item in data]  # Encode data as UTF-8
    encoded_canceled_data = [force_bytes(item, encoding='utf-8') for item in canceled_data]  # Encode canceled_data as UTF-8
    return Response({"data": encoded_data, "canceled_data": encoded_canceled_data}, status=status.HTTP_201_CREATED)


def All_Files(owner):
        files = list(File.objects.filter(owner=owner))
        owner_all_files = [{"file":file.file,"size":file.size,"file_type":file.file_type,'uploaded_at':file.uploaded_at,"id":file.id,"owner":file.owner} for file in files]
        return owner_all_files


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_owner_files(request, pk=None):
    owner = str(request.user.id)

    if not owner:
        return Response({'error': 'Please provide the owner parameter'}, status=status.HTTP_400_BAD_REQUEST)

    if pk:
        try:
            file = File.objects.filter(owner=owner, id=pk).first()

            if not file:
                return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

            folder_dict = {
                'id': file.folder.id,
                'foldername': file.folder.foldername,
                'owner': file.folder.owner.username
            }

            file_dict = {
                'file': file.file.url,
                'size': file.size,
                'file_type': file.file_type,
                'uploaded_at': file.uploaded_at,
                'id': file.id,
                'owner': file.owner.username,
                'folder': folder_dict
            }

            return Response(file_dict, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Error occurred, check your connection and try again. If you are accessing an individual file, please try with the correct ID'}, status=status.HTTP_404_NOT_FOUND)

    files = File.objects.filter(owner=owner)
    file_list = []
    for file in files:
        folder_dict = {
            'id': file.folder.id,
            'foldername': file.folder.foldername,
            'owner': file.folder.owner.username
        }

        file_dict = {
            'file': file.file.url,
            'size': file.size,
            'file_type': file.file_type,
            'uploaded_at': file.uploaded_at,
            'id': file.id,
            'owner': file.owner.username,
            'folder': folder_dict
        }
        file_list.append(file_dict)

    return Response(file_list, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_folder_files(request):
    folderID = request.GET.get('folderID') or request.data.get('folderID')

    try:
        folder = Folder.objects.get(id=folderID)
        user = User.objects.get(id=request.user.id)
        if str(request.user.id) != str(folder.owner.id) and user not in folder.shared_with.all():
            return Response({'error': 'Sorry, you have no access to this folder'}, status=status.HTTP_403_FORBIDDEN)

        files = File.objects.filter(folder=folder)
        file_list = []

        for file in files:
            file_dict = {
                'file': file.file.url,
                'size': file.size,
                'file_type': file.file_type,
                'uploaded_at': file.uploaded_at,
                'id': file.id,
                'owner': file.owner.username
            }
            file_list.append(file_dict)

        return Response(file_list, status=status.HTTP_200_OK)
    except Folder.DoesNotExist:
        return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_shared_folder_files(request):
        folderID = request.data["folderID"]
        user = request.user
        try:
            folder =Folder.objects.get(id=folderID,shared_with__in=[str(user.id)])  # Query the folders based on owner and shared_with
            print(folder)
            files = File.objects.filter(folder=folder)

            file_list = []

            for file in files:
                file_dict = {
                    'file': file.file,
                    'size': file.size,
                    'file_type': file.file_type,
                    'uploaded_at': file.uploaded_at,
                    'id': file.id,
                    'owner': file.owner.username,
                    'folder': file.folder.foldername
                }
                file_list.append(file_dict)

            return Response(file_list, status=status.HTTP_200_OK)
        except Folder.DoesNotExist:
            return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
       # except:  return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_file(request):
    id = request.data["id"]
    if not id:
        return Response({'error': 'Please provide the file ID'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        file = File.objects.get(id=id)
    except File.DoesNotExist:
        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'check your internate connection or use valid id'}, status=status.HTTP_404_NOT_FOUND)
  
    owner = file.owner
    if owner != request.user:
        return Response({'error': 'You do not have permission to delete this file'}, status=status.HTTP_403_FORBIDDEN)

    file.delete()
    return Response({'message': 'File successfully deleted'}, status=status.HTTP_200_OK)




import os
import pandas as pd
from .model_generator.model import Model_Generator,Process_Each_file
from .model_generator.check import Check_similarity
from django.conf import settings


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Create_model(request):
    folderID = request.GET.get('folderID') or request.data.get('folderID')
    try:
        files = File.objects.filter(owner=str(request.user.id), folder=folderID)
    except Folder.DoesNotExist:
        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

    data = []
    for file in files:
        file_path = os.path.join(settings.MEDIA_ROOT, file.file.name)
        print(file_path)
        file_data = Process_Each_file(file_path)
        data.extend(file_data)

    df = pd.DataFrame(data)
    print(df)
    models = Model_Generator(df, request.user.email)
    models["folder"] = folderID
    models["owner"] = str(request.user.id)

    print(models)

    try:
        print("existed model")
        model_exist = Model.objects.filter(owner=str(request.user.id), folder=folderID).first()

        if model_exist:
            serializer = ModelSerializer(model_exist, data=models, partial=True)
        else:
            serializer = ModelSerializer(data=models)

        if serializer.is_valid():
            serializer.save()
            if model_exist:
                return Response({'msg': "model updated successfully", 'data': serializer.data},
                                 status=status.HTTP_200_OK)
            else:
                return Response({'msg': "model generated successfully", 'data': serializer.data},
                                status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_files(request):
    files = request.FILES.getlist('files')
    folderID= request.data.get('folderID')
    if not files:
        return Response({'error': 'Please provide files'}, status=status.HTTP_400_BAD_REQUEST)
    print(folderID)
    try:
        
        folder = Folder.objects.get(id=folderID)
        user = User.objects.get(id=request.user.id)
        if str(request.user.id) != str(folder.owner.id) and user not in folder.shared_with.all():
            return Response({'error': 'Sorry, you have no access to this folder'}, status=status.HTTP_403_FORBIDDEN)
   
    except Folder.DoesNotExist:
          return Response({'error': 'Model not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        
        model_exist = Model.objects.get(folder=folderID)
    except Model.DoesNotExist:
          return Response({'error': 'Model not found'}, status=status.HTTP_404_NOT_FOUND)

    print("reading", model_exist.model, model_exist.text_vectorized, model_exist.text_data)
    checked = Check_similarity(files, model_exist.model, model_exist.text_vectorized, model_exist.text_data)
    # Convert the processed DataFrame to a list of dictionaries
    data = checked.to_dict(orient='records')

    return Response({'data': data}, status=status.HTTP_200_OK)


#for summarization
API_TOKEN='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'

import requests
import logging
import os
import PyPDF2
from docx import Document
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

API_URL_2 = "https://api-inference.huggingface.co/models/google/pegasus-xsum"
@api_view(['POST'])
def summarize_low(request):
    file = request.FILES.get("file")
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    max_length = int(request.data.get("maxL", 1024))
    min_length = max_length // 4
    if not file:
        data = request.data.get("data", "")
        if max_length>len(data):
          max_length=len(data)
    else:
        data = read_text_files(file)
        data=data[0]
        if max_length>len(data):
          max_length=len(data)
    
    

    print(max_length,min_length,len(data))
    def query(payload):
        try:
            response = requests.post(API_URL_2, headers=headers, json=payload)
            return response.json()
        except requests.exceptions.RequestException as e:
            # Log the error or handle it appropriately
            logging.error(f"Request failed: {str(e)}")
            raise
    
    try:
     output = query({
            "inputs": data,
            "parameters": {"min_length": min_length, "max_length": max_length},
        })

     return Response(output[0], status=status.HTTP_200_OK)
    except Exception as e:
       return Response({"error": f"Failed to process the request: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#API_URL = "https://api-inference.huggingface.co/models/google/pegasus-cnn_dailymail"
API_URL = "https://api-inference.huggingface.co/models/google/pegasus-large"
@api_view(['POST'])
def summarize_high(request):
    file = request.FILES.get("file")
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    max_length = int(request.data.get("maxL", 1024))
    min_length = max_length // 4
    if not file:
        data = request.data.get("data", "")
        if max_length>len(data):
          max_length=len(data)
    else:
        data = read_text_files(file)
        data=data[0]
        if max_length>len(data):
          max_length=len(data)
    

    print(max_length,min_length,len(data))
    def query(payload):
        try:
            response = requests.post(API_URL, headers=headers, json=payload)
            return response.json()
        except requests.exceptions.RequestException as e:
            # Log the error or handle it appropriately
            logging.error(f"Request failed: {str(e)}")
            raise
    
    try:
     output = query({
            "inputs": data,
            "parameters": {"min_length": min_length, "max_length": max_length},
        })
     print(output)
     return Response(output[0], status=status.HTTP_200_OK)
    except Exception as e:
       return Response({"error": f"Failed to process the request: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def extract_text_from_pdf(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        text += page.extract_text()
    return text

def read_text_files(file):
    data = []
    if file.name.endswith('.txt'):
        document = file.read().decode("utf-8")  # Decode the bytes to string
        data.append(document)
    elif file.name.endswith('.pdf'):
        try:
            text = extract_text_from_pdf(file)
            data.append(text)
        except Exception as e:
            # Log the error or handle it appropriately
            logging.error(f"Failed to extract text from PDF: {str(e)}")
    elif file.name.endswith('.doc') or file.name.endswith('.docx'):
        try:
            doc = Document(file)
            document = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
            data.append(document)
        except Exception as e:
            # Log the error or handle it appropriately
            logging.error(f"Failed to read text from DOCX: {str(e)}")

    return data
'''
def exrtract_filename(owner,folder):
        files = list(File.objects.filter(owner=owner,folder=folder))
        owner_all_files = [[file.filename,file.file_type] for file in files]
        return owner_all_files

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_file(request):
    folderID=request.data["folder"]
    ownerID=request.data["owner"]
    owner=str(request.user.id)

    if not folderID:
        return Response({'error': 'Please provide the folder ID'}, status=status.HTTP_400_BAD_REQUEST)

    if owner != ownerID:
        return Response({'error': 'You can only add file on your field'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        folder = Folder.objects.get(id=folderID,owner=owner)
    except Folder.DoesNotExist:
        return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'check your internate connection or use valid id'}, status=status.HTTP_404_NOT_FOUND)
  

    owner_all_files = exrtract_filename(owner,folder)
    if [request.data["filename"],request.data["file_type"]] in owner_all_files or [request.data["file_type"],request.data["filename"]] in owner_all_files:
      return Response({"msg":"sorry, this file is already exist. it make the optimization difficult so try to use different."}, status=404)
        
    serializer = FileSerializer(data=request.data)
    if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def All_Files(owner):
        files = list(File.objects.filter(owner=owner))
        owner_all_files = [{"filename":file.filename,"size":file.size,"file_type":file.file_type,'uploaded_at':file.uploaded_at,"id":file.id,"owner":file.owner} for file in files]
        return owner_all_files


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_owner_files(request,pk=None):
    owner = str(request.user.id)
          
    if not owner:
            return Response({'error': 'Please provide the owner parameter'}, status=status.HTTP_400_BAD_REQUEST)
       
    if pk:
  
        try:
            file = File.objects.filter(owner=owner,id=pk)
            file = file[0]  # Get the first file object

            folder_dict = {
                'id': file.folder.id,
                'foldername': file.folder.foldername,
                'owner': file.folder.owner.username
            }

            file_dict = {
                'filename': file.filename,
                'size': file.size,
                'file_type': file.file_type,
                'uploaded_at': file.uploaded_at,
                'id': file.id,
                'owner': file.owner.username,
                'folder': folder_dict
            }
             
            return Response(file_dict, status=status.HTTP_200_OK)
        except File.DoesNotExist:
            return Response({'error': 'file not found'}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({'error': 'Error occured, check your connection and try again. if you are accessing individual user, please try with correct ID'}, status=status.HTTP_404_NOT_FOUND)
    
  
    files = File.objects.filter(owner=owner)
    file_list = []
    for file in files:
        folder_dict = {
                'id': file.folder.id,
                'foldername': file.folder.foldername,
                'owner': file.folder.owner.username
            }

        file_dict = {
                'filename': file.filename,
                'size': file.size,
                'file_type': file.file_type,
                'uploaded_at': file.uploaded_at,
                'id': file.id,
                'owner': file.owner.username,
                'folder': folder_dict
            }
        file_list.append(file_dict)

    return Response(file_list, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_folder_files(request):
    #folderID=request.data["folderID"]
    folderID = request.GET.get('folderID') or request.data.get('folderID')
    try:
        folder = Folder.objects.get(id=folderID)
        user = User.objects.get(id=request.user.id)
        if str(request.user.id)!=folder.owner and user not in folder.shared_with.all():
            Response({'error': 'Sorry you have no access for this folder'}, status=status.HTTP_404_NOT_FOUND)
       
        files = File.objects.filter(folder=folder)
        file_list = []

        for file in files:
            file_dict = {
                'filename': file.filename,
                'size': file.size,
                'file_type': file.file_type,
                'uploaded_at': file.uploaded_at,
                'id': file.id,
                'owner': file.owner.username
            }
            file_list.append(file_dict)

        return Response(file_list, status=status.HTTP_200_OK)
    except Folder.DoesNotExist:
        return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_shared_folder_files(request):
        folderID = request.data["folderID"]
        user = request.user
        try:
            folder =Folder.objects.get(id=folderID,shared_with__in=[str(user.id)])  # Query the folders based on owner and shared_with
            print(folder)
            files = File.objects.filter(folder=folder)

            file_list = []

            for file in files:
                file_dict = {
                    'filename': file.filename,
                    'size': file.size,
                    'file_type': file.file_type,
                    'uploaded_at': file.uploaded_at,
                    'id': file.id,
                    'owner': file.owner.username,
                    'folder': file.folder.foldername
                }
                file_list.append(file_dict)

            return Response(file_list, status=status.HTTP_200_OK)
        except Folder.DoesNotExist:
            return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
       # except:  return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_file(request):
'''