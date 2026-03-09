New-Item -ItemType Directory -Force -Path backend
python -m venv backend\venv
backend\venv\Scripts\python.exe -m pip install --upgrade pip
backend\venv\Scripts\pip.exe install django djangorestframework djangorestframework-simplejwt django-cors-headers scikit-learn pandas numpy spacy nltk pymupdf
backend\venv\Scripts\django-admin.exe startproject smart_placement backend
backend\venv\Scripts\python.exe backend\manage.py startapp core
backend\venv\Scripts\python.exe backend\manage.py startapp ml_engine
backend\venv\Scripts\python.exe -m spacy download en_core_web_sm
