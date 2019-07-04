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

#### GET /api/v1/hollow-knight/locations

#### List of Locations
| Name        | Description                                       | Type   |
| ------------|:-------------------------------------------------:| ----:  |
| `id`          | The identifier for location                       | `number` |
| `name`        | The name  of the location                         | `string` |
| `image`       | A link to an image of the location                | `string` | 

## Specific Resource 

### GET /api/v1/hollow-knight/bosses/{id}

| Name        | Description                                       | Type   |
| ------------|:-------------------------------------------------:| ----:  |
| `id`          | The identifier for the boss                       | `number` |
| `name`        | The name  of the boss                             | `string` |
| `image`       | A link to an image of the boss                    | `string` | 
| `location_id` | The identifier of the location of the boss        | `number` |

### GET /api/v1/hollow-knight/friendly-npcs/{id}

| Name        | Description                                       | Type   |
| ------------|:-------------------------------------------------:| ----:  |
| `id`          | The identifier for the friendly npc               | `number` |
| `name`        | The name  of the friendly npc                     | `string` |
| `image`       | A link to an image of the boss                    | `string` | 
| `location_id` | The identifier of the location of the npc         | `number` |

### GET /api/v1/hollow-knight/locations/{id}

| Name        | Description                                       | Type   |
| ------------|:-------------------------------------------------:| ----:  |
| `id`          | The identifier for location                       | `number` |
| `name`        | The name  of the location                         | `string` |
| `image`       | A link to an image of the location                | `string` | 


## Create

### POST /api/v1/hollow-knight/bosses/

| Name | Description                                    | Type    |
|------|:----------------------------------------------:|--------:|
| `name`| Name of the boss                              | `string`|
| `image`| Link to an image of the boss                 | `string`|
| `location`| Name of the location the boss is found in | `string`|

### POST /api/v1/hollow-knight/friendly-npcs/

| Name | Description                                    | Type    |
|------|:----------------------------------------------:|--------:|
| `name`| Name of the friendly npc                      | `string`|
| `image`| Link to an image of the friendly npc         | `string`|
| `location`| Name of the location the npc is found in  | `string`|

### POST /api/v1/hollow-knight/locations/

| Name | Description                                    | Type    |
|------|:----------------------------------------------:|--------:|
| `name`| Name of the location                          | `string`|
| `image`| Link to an image of the location             | `string`|


## Delete 

#### DELETE /api/v1/hollow-knight/bosses/{id}

#### DELETE /api/v1/hollow-knight/friendly-npcs/{id}

#### DELETE /api/v1/hollow-knight/locations/{id}


## Technologies used
* Knex 
* PostgreSQL
* Node
* Express 
* Heroku 
