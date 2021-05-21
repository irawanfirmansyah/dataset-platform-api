# REST API app for Dataset Management Platform

This app is built on top of [ExpressJS](https://expressjs.com/) framework. 
<br/>
Here's a quick way to start this app on your local machine :

---
```sh
git clone https://github.com/irawanfirmansyah/dataset-platform-api.git
cd dataset-platform-api
npm install
npm run dev
```
---


## APIs
1. User
    * Login -> /user/login (POST)
        <br/>
        JSON :
        ```sh
        {
            "email": "admin@example.com",
            "password": "admin123456"
        }
        ```

2. Task (File)
    * Get All Task -> /task (GET)
    * Get All Task by User Logged In -> /task/booked (GET, must login first to attach bearer token)
    * Download Task -> /task/download?task_id={taskId} (GET)
    * Upload Task -> /task (POST)
        <br/>
        Form Data :
        ```sh
        name - string
        dataset - zip file
        ```
    * Delete Task -> /task/:taskID (DELETE)

3. User Task
    - Get All User Task -> /user_task (GET)
    - Invoke (Book) Task -> /user_task (POST)
        <br/>
        JSON :
        ```sh
        {
            "user_id": 1,
            "task_id": 2
        }
        ```
    - Revoke Task by User -> /user_task (DELETE)
        <br/>
        JSON :
        ```sh
        {
            "user_id": 1,
            "task_id": 5
        }
        ```
    - Get ALl User Task -> /user_task (GET)