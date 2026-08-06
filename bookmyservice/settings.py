
import os
from pathlib import Path
from dotenv import load_dotenv

# 🛠️ ADDED: Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
# 🛠️ UPDATED: Fetches from .env, uses default if not found
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-a^@ckiv%!loibo3h+d4qk2d^8%ss=zv+rf_o2+re)!_v754-%s')

# SECURITY WARNING: don't run with debug turned on in production!
# 🛠️ UPDATED: Uses .env to determine DEBUG mode (Set DEBUG=False in production .env)
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# 🛠️ UPDATED: Fetch allowed hosts from .env
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt', 
    'corsheaders',
    'accounts',
    'vehicles',
    'appointments',     
]

AUTH_USER_MODEL = 'accounts.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated', # Protects all endpoints by default
    ),
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Ensure frontend API calls exactly match backend URLs (including trailing slashes)
APPEND_SLASH = True

ROOT_URLCONF = 'bookmyservice.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
# 🛠️ UPDATED: Fetching Email credentials from .env
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'sahadedappal@gmail.com')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

WSGI_APPLICATION = 'bookmyservice.wsgi.application'


# Database Configuration
# 🛠️ UPDATED: Database credentials can also be moved to .env for better security
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'bookmyservice'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'USER': os.environ.get('DB_USER', 'root'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'root123'),
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = [
    'accounts.authentication.EmailOrUsernameModelBackend', # Custom auth backend
    'django.contrib.auth.backends.ModelBackend',           # Default fallback
]


# CORS Allowed Origins Whitelist
# 🛠️ UPDATED: Added environment variable support for CORS
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS', 
    "http://localhost:3000,http://127.0.0.1:3000"
).split(',')

# Explicitly allow the Authorization headers to prevent browser pre-flight blocks
from corsheaders.defaults import default_headers
CORS_ALLOW_HEADERS = list(default_headers) + [
    'authorization',
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
# 🛠️ ADDED: STATIC_ROOT is required when deploying Django projects
STATIC_ROOT = BASE_DIR / 'staticfiles'