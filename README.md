# Palette-Picker Api 

## Description 

This project is a RESTful api for the purpose of allowing users to create projects w/ color palettes. It is a relational database utilizing a one-to-many relationship. The app was built with Node and Express, and is deployed to (Heroku)[Placeholder]

## Important Notes:
- Base URL= https://color-me-newton-api.herokuapp.com/api/v1/
- The Palettes are dependant on Projects.
  - If you delete a Project, it will delete all corresponding Palettes
  - If you create a Palette and do not supply a Project_id, the backend will create a new default project for association.

## Resource Lists 

#### GET /api/v1/projects

#### List of Projects
| Name        | Description                                       | Type     |
| ------------|:-------------------------------------------------:| ----:    |
| `id`        | The identifier for the project                    | `number` |
| `name`      | The name  of the project                          | `string` |

- Expected output:
```
[
    {
        "id": 1,
        "name": "Test",
        "created_at": "2019-07-04T18:54:16.664Z",
        "updated_at": "2019-07-04T18:54:16.664Z"
    }
]
```

#### GET /api/v1/palettes

#### List of Palettes 
| Name          | Description                                       | Type     |
| --------------|:-------------------------------------------------:| ------:  |
| `id`          | The identifier for the friendly npc               | `number` |
| `name`        | The name  of the friendly npc                     | `string` |
| `color_1`     | HEX value for palette color_1                     | `string` | 
| `color_2`     | HEX value for palette color_2                     | `string` | 
| `color_3`     | HEX value for palette color_3                     | `string` | 
| `color_4`     | HEX value for palette color_4                     | `string` | 
| `color_5`     | HEX value for palette color_5                     | `string` | 
| `project_id`  | The identifier of the project of the palette      | `number` |

- Expected Output:
```
[
    {
        "id": 1,
        "project_id": 1,
        "name": "test palette",
        "color_1": "A8E0FF",
        "color_2": "8EE3F5",
        "color_3": "70CAD1",
        "color_4": "3E517A",
        "color_5": "B08EA2",
        "created_at": "2019-07-04T18:54:16.730Z",
        "updated_at": "2019-07-04T18:54:16.730Z"
    }
]
```

## Specific Resource 

### GET /api/v1/projects/{id}

- Single Project
| Name        | Description                                       | Type     |
| ------------|:-------------------------------------------------:| ----:    |
| `id`        | The identifier for the project                    | `number` |
| `name`      | The name  of the project                          | `string` |


### GET /api/v1/palettes/{id}

- Single Palette
| Name          | Description                                       | Type     |
| --------------|:-------------------------------------------------:| ------:  |
| `id`          | The identifier for the friendly npc               | `number` |
| `name`        | The name  of the friendly npc                     | `string` |
| `color_1`     | HEX value for palette color_1                     | `string` | 
| `color_2`     | HEX value for palette color_2                     | `string` | 
| `color_3`     | HEX value for palette color_3                     | `string` | 
| `color_4`     | HEX value for palette color_4                     | `string` | 
| `color_5`     | HEX value for palette color_5                     | `string` | 
| `project_id`  | The identifier of the project of the palette      | `number` |


## Create

### POST /api/v1/projects

| Name        | Description                                       | Type     |
| ------------|:-------------------------------------------------:| ----:    |
| `id`        | The identifier for the project                    | `number` |
| `name`      | The name  of the project                          | `string` |

- Make sure the format looks like this:
```
{name: 'Project Name'}
```

### POST /api/v1/palettes/

| Name          | Description                                       | Type     |
| --------------|:-------------------------------------------------:| ------:  |
| `id`          | The identifier for the friendly npc               | `number` |
| `name`        | The name  of the friendly npc                     | `string` |
| `color_1`     | HEX value for palette color_1                     | `string` | 
| `color_2`     | HEX value for palette color_2                     | `string` | 
| `color_3`     | HEX value for palette color_3                     | `string` | 
| `color_4`     | HEX value for palette color_4                     | `string` | 
| `color_5`     | HEX value for palette color_5                     | `string` | 
| `project_id`  | The identifier of the project of the palette      | `number` |

- Make sure the format looks like this:
  - Must have 6 digits for HEX value, like the below example
  - Project_id needs to be passed through with the object. If creating a new project, make sure to fire the Post request for that first. Then you can grab the id from Project Post request. If no Project_id is passed, the backend will create a default.
```
{
 name: 'Palette name',
 color_1: '3e3e3e',
 color_2: '6f6f6f',
 color_3: '7e7e7e',
 color_4: 'eeeeee',
 color_5: '999999',
 project_id: 1
}
```


## Delete 

#### DELETE /api/v1/projects/{id}

#### DELETE /api/v1/palettes/{id}



## Technologies used
* Knex 
* PostgreSQL
* Node
* Express 
* Heroku 
* TravisCI
