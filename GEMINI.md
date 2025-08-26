So as you can see the event-frontend directory is setup and I have installed, tailwindCSS, react-router-dom, and react-icons, So you don't need to install any of those, and If you do install any ui library, like material ui, don't run that command directly, you just generate the stuff and tell me later which libraries I need to install. Next Make the pages and the components in the fontend, and use the endpoints provided in this readme file to fetch the respective apis in the frontend, according to the following instructions:
This is a React + Vite + Typescript frontend, make everything typescript.
1- We'll have a nice home page saying welcome to "Event-management-site", and a nice Navbar.
2- We'll make login and signup pages for users, and provide their routes in the navbar, and login page for admin.
3- Don't use redux, instead use authContext for global context
4- Read the backend to understand how the response are being sent, and then user those accordingly
5- Then have a logout button on the navbar that'll fetch the admin logout or the user logout based on wether admin logged in or user logged in
6- Now make the events page, where all the events will be listed as cards, and make a add event button, that lets the current user create an event.
7- Make the event form in a component and open it in a popup and for categories get the list of categories with the endpoint in this readme file and show the available ones under the category section in like a small straight line
8- Then when a different user clicks the event card they will get a popup with the event details in it, and make that a component as well, and they'll get their apply button and that will make them apply to that event, and he'll also get a button to withdraw from the event. And if the same user that created the event opens it, he will get the option to update or delete it, the update form will also be a popup.
9- Next make the admin pannel, the ui will be a lot different, the admin dashboard will show everything, that the admin/dashboard shows, and he'll be able to update and delete all the events, and he'll also be able to remove any user from an event
10- Try to implement hooks for the api calls, and tell me how you've implemented it

For now, let's do this much, and then suggest me further what to do, and yes you can edit the event-frontend to make these pages, components, contexts and hooks, and don't edit anything in event-backend, ok.

event-backend/README.md
These are the endpoints that'll be consumed by the frontend, 

api = http://127.0.0.1:3000

Use the endpoints in frontend as mentioned below, I'll add the value of api later

****### User Authentication| Method | URL | Purpose || :--- | :--- | :--- 

|| `POST` | `api/register` | Create a new user account. compleated
|| `POST` | `api/login` | Log in a user and get a JWT.  compleated
|| `DELETE`| `api/logout` | Log out a user and invalidate their JWT.  compleated

|***### Categories| Method | URL | Purpose || :--- | :--- | :--- 

|| `GET` | `api/categories` | Get a list of all categories.
response:
[
	{
		"id": 1,
		"name": "meetups",
		"created_at": "2025-08-25T05:56:10.997Z",
		"updated_at": "2025-08-25T05:56:10.997Z"
	},
	{
		"id": 2,
		"name": "concert",
		"created_at": "2025-08-25T21:27:15.617Z",
		"updated_at": "2025-08-25T21:27:15.617Z"
	}
]


|***### Events| Method | URL | Purpose || :--- | :--- | :--- 

|| `GET` | `api/events` | Get a list of all events.
response:
[
	{
		"id": 4,
		"title": "My Awesome Tech Meetup",
		"description": "A great meetup to discuss the latest in web development and technology. Come join us for talks and networking!",
		"date": "2025-10-15T18:30:00.000Z",
		"location": "123 Tech Street, Innovation City",
		"user_id": 8,
		"created_at": "2025-08-26T10:36:14.068Z",
		"updated_at": "2025-08-26T10:36:14.068Z",
		"poster_url": "https://res.cloudinary.com/dxf7nv9mt/image/upload/v1743092268/bcxi2p0no0qjbayknlvd.png",
		"category_id": 1,
		"user": {
			"id": 8,
			"email": "test1@mail.com",
			"username": "test1",
			"created_at": "2025-08-25T04:39:00.270Z",
			"updated_at": "2025-08-25T04:39:00.270Z",
			"password_digest": "$2a$12$XbG.xByN8.UmAn8hwQBq4uzxy5YK0vhRi6ykfhcwcjX8A6vpdj.GK"
		},
		"category": {
			"id": 1,
			"name": "meetups",
			"created_at": "2025-08-25T05:56:10.997Z",
			"updated_at": "2025-08-25T05:56:10.997Z"
		}
	}
]

|| `GET` | `api/events/:id` | Get details for a single event. 
response:
{
	"id": 4,
	"title": "My Awesome Tech Meetup",
	"description": "A great meetup to discuss the latest in web development and technology. Come join us for talks and networking!",
	"date": "2025-10-15T18:30:00.000Z",
	"location": "123 Tech Street, Innovation City",
	"user_id": 8,
	"created_at": "2025-08-26T10:36:14.068Z",
	"updated_at": "2025-08-26T10:36:14.068Z",
	"poster_url": "https://res.cloudinary.com/dxf7nv9mt/image/upload/v1743092268/bcxi2p0no0qjbayknlvd.png",
	"category_id": 1,
	"user": {
		"id": 8,
		"email": "test1@mail.com",
		"username": "test1",
		"created_at": "2025-08-25T04:39:00.270Z",
		"updated_at": "2025-08-25T04:39:00.270Z",
		"password_digest": "$2a$12$XbG.xByN8.UmAn8hwQBq4uzxy5YK0vhRi6ykfhcwcjX8A6vpdj.GK"
	},
	"category": {
		"id": 1,
		"name": "meetups",
		"created_at": "2025-08-25T05:56:10.997Z",
		"updated_at": "2025-08-25T05:56:10.997Z"
	}
}

|| `POST` | `api/events` | Create a new event (requires auth). 
body:
{
  "event": {
    "title": "My Awesome Tech Meetup",
    "description": "A great meetup to discuss the latest in web development and technology. Come join us for talks and networking!",
    "date": "2025-10-15T18:30:00Z",
    "location": "123 Tech Street, Innovation City",
    "poster_url": "https://res.cloudinary.com/dxf7nv9mt/image/upload/v1743092268/bcxi2p0no0qjbayknlvd.png",
    "category_id": 1
  }
}
response:
{
	"id": 4,
	"title": "My Awesome Tech Meetup",
	"description": "A great meetup to discuss the latest in web development and technology. Come join us for talks and networking!",
	"date": "2025-10-15T18:30:00.000Z",
	"location": "123 Tech Street, Innovation City",
	"user_id": 8,
	"created_at": "2025-08-26T10:36:14.068Z",
	"updated_at": "2025-08-26T10:36:14.068Z",
	"poster_url": "https://res.cloudinary.com/dxf7nv9mt/image/upload/v1743092268/bcxi2p0no0qjbayknlvd.png",
	"category_id": 1
}

|| `PATCH`/`PUT`| `api/events/:id` | Update an event you created (requires auth).
body:
{
  "event": {
    "title": "My Awesome Tech Meetup",
    "description": "A great meetup to discuss the latest in web development and technology. Come join us for talks and networking!",
    "date": "2025-10-15T18:30:00Z",
    "location": "123 Tech Street, Bangalore City",
    "poster_url": "https://res.cloudinary.com/dxf7nv9mt/image/upload/v1743092268/bcxi2p0no0qjbayknlvd.png",
    "category_id": 1
  }
}
response:
{
	"title": "My Awesome Tech Meetup",
	"description": "A great meetup to discuss the latest in web development and technology. Come join us for talks and networking!",
	"date": "2025-10-15T18:30:00.000Z",
	"location": "123 Tech Street, Bangalore City",
	"poster_url": "https://res.cloudinary.com/dxf7nv9mt/image/upload/v1743092268/bcxi2p0no0qjbayknlvd.png",
	"category_id": 1,
	"user_id": 8,
	"id": 4,
	"created_at": "2025-08-26T10:36:14.068Z",
	"updated_at": "2025-08-26T10:38:32.508Z"
}

|| `DELETE`| `api/events/:id` | Delete an event you created (requires auth). 
response:
204 No content

|***### Event Participants| Method | URL | Purpose || :--- | :--- | :--- 

|| `GET` | `api/events/:event_id/participants` | Get a list of all participants for a specific event. this is coming from it's own table, don't put it under the event table, this is not a field in the event table, it just takes an event_id, that's all
response:
{
	"id": 2,
	"event_id": 2,
	"user_id": 8,
	"created_at": "2025-08-25T21:40:42.347Z",
	"updated_at": "2025-08-25T21:40:42.347Z"
}

|| `POST` | `api/events/:event_id/participants` | Join an event (requires auth). 
response:
{
	"id": 2,
	"event_id": 2,
	"user_id": 8,
	"created_at": "2025-08-25T21:40:42.347Z",
	"updated_at": "2025-08-25T21:40:42.347Z"
}

|| `DELETE`| `api/participants/:id` | Leave an event (requires auth). 
204 No Content

|***### Admin PanelAll these routes require an admin to be authenticated via the admin login 
`POST /admins/sign_in`
response:
{
	"status": {
		"code": 200,
		"message": "Admin login successful."
	},
	"data": {
		"id": 1,
		"email": "new_admin@example.com"
	}
}

and logout via `DELETE /admins/sign_out`
response:
{
	"status": 200,
	"message": "Admin logged out successfully."
}

|| `GET` | `api/admin/dashboard` | View admin dashboard stats. 
response:
{
	"total_users": 3,
	"total_events": 1,
	"recent_events": [
		{
			"id": 2,
			"title": "My Awesome Tech Meetup",
			"description": "A great meetup to discuss the latest in web development and technology. Come join us for talks and networking!",
			"date": "2025-10-15T18:30:00.000Z",
			"location": "123 Tech Street, Innovation City",
			"user_id": 8,
			"created_at": "2025-08-25T10:22:20.377Z",
			"updated_at": "2025-08-25T10:22:20.377Z",
			"poster_url": "https://res.cloudinary.com/dxf7nv9mt/image/upload/v1743092268/bcxi2p0no0qjbayknlvd.png",
			"category_id": 1
		}
	]
}

|| `GET` | `api/admin/events` | View all events as an admin. 
response:
{
	"events": [
		{
			"id": 2,
			"title": "My Awesome Tech Meetup",
			"description": "A great meetup to discuss the latest in web development and technology. Come join us for talks and networking!",
			"date": "2025-10-15T18:30:00.000Z",
			"location": "123 Tech Street, Innovation City",
			"user_id": 8,
			"created_at": "2025-08-25T10:22:20.377Z",
			"updated_at": "2025-08-25T10:22:20.377Z",
			"poster_url": "https://res.cloudinary.com/dxf7nv9mt/image/upload/v1743092268/bcxi2p0no0qjbayknlvd.png",
			"category_id": 1
		}
	]
}

|| `DELETE`| `api/admin/events/:id` | Delete any event as an admin. 
response:
{
	"message": "Event deleted successfully"
}

|| `GET` | `api/admin/categories`| View all categories as an admin. 
response:
[
	{
		"id": 1,
		"name": "meetups",
		"created_at": "2025-08-25T05:56:10.997Z",
		"updated_at": "2025-08-25T05:56:10.997Z"
	},
	{
		"id": 2,
		"name": "concert",
		"created_at": "2025-08-25T21:27:15.617Z",
		"updated_at": "2025-08-25T21:27:15.617Z"
	}
]

|| `POST` | `api/admin/categories`| Create a new category as an admin.
body:
{
	"name": "concert"
}
response:
{
	"id": 2,
	"name": "concert",
	"created_at": "2025-08-25T21:27:15.617Z",
	"updated_at": "2025-08-25T21:27:15.617Z"
}

||`DELETE` | `api/admin/participants/:id`| Remove a participant from an event
response:
204 No Content
||`GET` | `api/admin/events/:id/participants`| Get participants for a specific event as admin
response:
[
	{
		"id": 2,
		"event_id": 2,
		"user_id": 8,
		"created_at": "2025-08-25T21:40:42.347Z",
		"updated_at": "2025-08-25T21:40:42.347Z",
		"user": {
			"id": 8,
			"email": "test1@mail.com",
			"username": "test1",
			"created_at": "2025-08-25T04:39:00.270Z",
			"updated_at": "2025-08-25T04:39:00.270Z",
			"password_digest": "$2a$12$XbG.xByN8.UmAn8hwQBq4uzxy5YK0vhRi6ykfhcwcjX8A6vpdj.GK"
		}
	}
]