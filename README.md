# Proje Kurulum ve Çalıştırma Rehberi

Bu proje, Python (FastAPI) backend ve React (Vite) frontend mimarisine sahiptir.
Projeyi ilk kez çalıştırmadan önce aşağıdaki kurulum adımlarını tamamlamanız gerekmektedir.

## 1. Kurulum (Dependencies)

### Backend Kurulumu
Backend klasöründe sanal ortam oluşturup gerekli Python paketlerini yüklemelisiniz.

Terminalde şu komutları sırasıyla çalıştırın:

```cmd
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Frontend Kurulumu
Frontend klasöründe gerekli Node.js paketlerini yüklemelisiniz.

```cmd
cd frontend
npm install
cd ..
```

## 2. Çalıştırma

Kurulumlar tamamlandıktan sonra projeyi çalıştırmak için ana dizindeki hazır scriptleri kullanabilirsiniz:

1.  **Backend'i başlatmak için:** `start_backend.bat` çift tıklayın (veya terminalden çalıştırın).
2.  **Frontend'i başlatmak için:** `start_frontend.bat` çift tıklayın (veya terminalden çalıştırın).

Backend `http://localhost:8001` portunda, Frontend ise genellikle `http://localhost:5173` portunda çalışacaktır.
