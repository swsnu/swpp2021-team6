[![Build Status](https://travis-ci.com/swsnu/swpp2021-team6.svg?branch=main)](https://travis-ci.com/swsnu/swpp2021-team6)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2021-team6&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2021-team6)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2021-team6/badge.svg?branch=main&sanitizer=True)](https://coveralls.io/github/swsnu/swpp2021-team6?branch=main)

## How to run

### Backend

```
cd backend
pip install -r requirements.txt
python manage.py makemigrations accounts posts
python manage.py migrate
python manage.py loaddata exercise-data
python manage.py runserver
coverage run --source='.' manage.py test

```

### Frontend

```
cd frontend
yarn install
yarn test
yarn start
```
