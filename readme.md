
# Test Data Generator Agent

A **Node.js API** for generating realistic test data for various scenarios.
It supports **dynamic schema detection**, **edge cases**, **nested objects**, **arrays**, and **custom rules**. Ideal for testing, prototyping, or generating dummy datasets.

---

## Features

- Auto-detect field types from field names (email, phone, address, date, uuid, etc.)  
- Generate **nested objects** and **array fields**  
- Add **edge cases** (null, empty string, negative numbers)  
- Supports **custom rules** and **enums**  
- Provides **summary statistics** (min/max for numbers, unique count for strings)  
- Modular structure with **controllers** and **routes**

---

## Requirements

- Node.js v18+  
- npm  

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Abdullah1811s/SPM-Test-data-generater-agent.git
cd test-data-agent
````

2. Install dependencies:

```bash
npm install
```

3. Run the server:

```bash
npm run dev
```

---

## API Endpoints

### 1. Health Check

* **URL:** `/health`
* **Method:** `GET`
* **Description:** Verify that the agent is running

**Example Request:**

```http
GET http://localhost:3000/health
```

**Example Response:**

```json
{
    "status": "67 🤷 Test Data Agent is alive and running!"
}
```

---

### 2. Generate Test Data

* **URL:** `/generate`
* **Method:** `POST`
* **Content-Type:** `application/json`
* **Description:** Generate test data based on a dynamic schema

**Request Body Format:**

```json
{
  "message_id": "msg-001",
  "sender": "frontend",
  "recipient": "test_data_agent",
  "type": "task_assignment",
  "timestamp": "2025-11-24T18:30:00Z",
  "results/task": {
    "fields": ["name","email","age","isActive"],
    "count": 5,
    "scenarios": [],
    "rules": {},
    "existing_data": null
  }
}
```

**Example Response:**

```json
{
    "message_id": "msg-001",
    "status": "success",
    "generated_data": [
        {
            "name": "Morris Jacobi",
            "email": "Adelbert21@yahoo.com",
            "age": 66,
            "isActive": false
        },
        {
            "name": "Della Hermiston",
            "email": "Matilda70@gmail.com",
            "age": 28,
            "isActive": true
        },
        {
            "name": "Darnell Kuhn",
            "email": "Robyn.Reynolds@gmail.com",
            "age": 9,
            "isActive": false
        },
        {
            "name": "Byron Hilpert",
            "email": "Raymundo.Aufderhar13@hotmail.com",
            "age": 86,
            "isActive": false
        },
        {
            "name": "Lorraine Ruecker",
            "email": "Catharine_Hodkiewicz61@gmail.com",
            "age": 23,
            "isActive": false
        }
    ],
    "summary": {
        "name": {
            "unique": 5
        },
        "email": {
            "unique": 5
        },
        "age": {
            "min": 9,
            "max": 86
        }
    }
}
```
