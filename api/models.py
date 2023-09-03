from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.core.exceptions import ValidationError
import os

def validate_unique_email(value):
    existing_user = User.objects.filter(email=value).exists()
    if existing_user:
        raise ValidationError('This email is already registered.')

class User(AbstractUser):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, validators=[validate_unique_email])
    type = models.CharField(max_length=20, default='person',choices=(('person', 'Person'), ('organization', 'Organization')))
    about = models.TextField(max_length=300,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sample=models.CharField(max_length=200,default='')
    profilePicture=models.CharField(max_length=300,blank=True)
  
    @property
    def shared_folders(self):
        return Folder.objects.filter(shared_with=self)
    
    def __str__(self):
        return self.username
    
class Folder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    foldername = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User,on_delete=models.CASCADE)
    shared_with = models.ManyToManyField(User, related_name='shared_folders',blank=True)
    
    def __str__(self):
        return self.foldername

class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to='files/')
    size = models.PositiveIntegerField(null=True, blank=True)
    file_type = models.CharField(max_length=255, blank=True)  # Add a file_type field
    uploaded_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.size = self.file.size
            self.file_type = self._get_file_type()  # Determine file type on save
        super().save(*args, **kwargs)

    def _get_file_type(self):
        file_extension = os.path.splitext(self.file.name)[1].lower()
        if file_extension == '.pdf':
            return 'PDF'
        elif file_extension == '.doc' or file_extension == '.docx':
            return 'DOC'
        elif file_extension == '.txt':
            return 'TXT'
        else:
            return 'Unknown'

class Model(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    model = models.CharField(max_length=255)
    text_data =  models.CharField(max_length=255)
    text_vectorized =  models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)


'''
class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    filename = models.CharField(max_length=255)
    size = models.PositiveIntegerField()
    file_type = models.CharField(max_length=5)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User,on_delete=models.CASCADE)
    folder = models.ForeignKey(Folder,on_delete=models.CASCADE)

    def __str__(self):
        return self.filename

'''      

'''
# Assuming you have a User instance called 'user'
file1 = File.objects.create(filename='file1.txt', size=100, file_type='txt')
file2 = File.objects.create(filename='file2.txt', size=200, file_type='txt')

user.files.append(file1)  # Add file1 to the user's files list
user.files.append(file2)  # Add file2 to the user's files list

user.save()  # Save the changes to the user

print(user.files)  # Print the files associated with the user

folder = Folder.objects.get(id=<folder_id>)
shared_users = folder.shared_with.all()

user = User.objects.get(username='example_user')
shared_folders = user.shared_folders()
'''