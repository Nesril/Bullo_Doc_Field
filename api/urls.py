from django.urls import path
from .views import summarize_low,summarize_high, Create_model,process_files,get_shared_folder_files,get_folder_files,remove_shared_users,remove_folder, get_shared_folder,get_shared_users,add_shared_users,create_folder,get_owner_folders, register_user, user_login, user_logout,get_user,update_user,add_files,get_owner_files,remove_file

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('users/', get_user, name='users'),
    path('users/<str:pk>/', get_user, name='each_users'),
    path('update/', update_user, name='update'),
   
    path('folder_create/', create_folder, name='folder_create'),
    path('folder_get/', get_owner_folders, name='folder_get'),
    path('folder_get/<str:pk>/', get_owner_folders, name='each_folder_get'),
    path('folder_add_shared_users/', add_shared_users, name='folder_add_shared_users'),
    path('folder_get_shared_users/', get_shared_users, name='get_shared_users'),
    path('folder_get_shared_folder/', get_shared_folder, name='get_shared_folder'),
    path('folder_remove_shared_users/', remove_shared_users, name='remove_shared_users'),
    path('folder_remove/', remove_folder, name='remove_folder'),
    
    path('file_add/', add_files, name='file_add'),
    path('file_get/', get_owner_files, name='get_owner_files'),
    path('file_get/<str:pk>/', get_owner_files, name='get_owner_files_each'),
    path('file_folder/', get_folder_files, name='file_folder'),
    path('file_shared_folder/', get_shared_folder_files, name='file_shared_folder'),
    path('file_delete/', remove_file, name='file_delete'),


    path('process_files/', process_files, name='process_files'),
    path('Create_model/', Create_model, name='Create_model'),
    path('summarize_low/', summarize_low, name='summarize_low'),
    path('summarize_high/', summarize_high, name='summarize_high'),

]


''''

from django.urls import path,include
from api.views import UserViewSet,FileViewSet
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("users", UserViewSet,basename='users')
router.register("file", FileViewSet,basename='file')

urlpatterns = [
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


 path('user/<str:pk>', UserAPIView.as_view(), name='user-detail'),
    path('file', FileAPIView.as_view(), name='file-list'),
    path('file/<str:pk>', FileAPIView.as_view(), name='file-detail'),
    path('file/savefile', SaveFileView.as_view(), name='file-save'),
'''

