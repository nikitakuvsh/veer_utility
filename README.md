Перейти в директорию backend
```
cd backend
```

Создать виртуальное окружение
```
python -m venv venv
```

Активировать виртуальное окружение
```
cd venv/Scripts && activate && cd ../../
```

Установить зависимости в виртуалку
```
pip install -r requirements.txt
```

Перейти на уровень выше
```
cd ../
```

Запустить бекенд
```
uvicorn backend.main:app --reload
```
