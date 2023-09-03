from rest_framework import serializers
from api.models import User,File,Folder,Model
from django.contrib.auth import get_user_model


class FolderSerializer(serializers.ModelSerializer):

    class Meta:
        model=Folder
        fields=('created_at','foldername','shared_with','id','owner')


class UserSerializer(serializers.ModelSerializer):

    shared_folders = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'password', 'about', 'email', 'profilePicture','updated_at', 'sample', 'type', 'created_at', 'id', 'shared_folders')
        extra_kwargs = {'password': {'write_only': True}}

    def get_shared_folders(self, obj):
        folders = obj.shared_folders.all()
        return FolderSerializer(folders, many=True).data

 
    def create(self, validated_data):
        User = get_user_model()
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            about=validated_data.get('about'),  # Include the 'about' field
            type=validated_data.get('type'), # Include the 'type' field
            profilePicture=validated_data.get('profilePicture')  # Include the 'type' field
        )
        return user
        

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'

class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = '__all__'
'''

class FileSerializer(serializers.ModelSerializer):

    class Meta:
        model=File
        fields=('uploaded_at','filename','size','id','file_type','owner','folder')

'''