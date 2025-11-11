# DeliveryManagement
E-Commerce fullstack website with self-written Dijkstra's Algorithm for finding the best routes for shipping on an improvised city map.

This project was created for the CodeRock 2024 Hackathon and then modified as a personal project for learning.

The old legacy version that was using Razor pages instead of a separate frontend: [DeliveryManagement-Legacy](https://github.com/bottomtext228/DeliveryManagement-Legacy)


## Overview
The website supports two types of users - **clients** and **companies** - each with distinct functionality.

###  Clients
- Browse all products from all companies  
- Add items to cart and place orders  
- Choose a company’s pick-up point for delivery  
- Select delivery route type: **cheapest** or **fastest**

### Companies
- Create and manage products (add, edit, delete)  
- Set up **stocks** and **pick-up points** in towns  

The system calculates delivery options using a **self-written Dijkstra’s algorithm** implemented on the backend.


### Tech stack:
### Backend
- **C# ASP.NET Core**
- **Entity Framework Core**
- **Identity** for authentication & roles
- **JWT** for secure authorization
- **Swagger/OpenAPI** for API documentation

### Frontend
- **React (TypeScript)**
- **React Router** - routing
- **TanStack Query** - data fetching and caching
- **Zustand** - state management
- **Axios** - API communication
- **React Hook Form** - form validation
- **Tailwind CSS** - styling
