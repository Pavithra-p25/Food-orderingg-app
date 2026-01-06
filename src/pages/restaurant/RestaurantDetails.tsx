// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Row, Col, Alert, Placeholder } from "react-bootstrap";
// import MyButton from "../../components/button/MyButton";
// import MyCard from "../../components/cards/MyCard";
// import "./restaurant.css";
// import { useRestaurants } from "../../hooks/restaurant/useRestaurant";

// const RestaurantDetails: React.FC = () => {
//   const { id } = useParams(); // get restaurant id from URL

//   // hook
//   const { getRestaurantDetails } = useRestaurants();

//   // Default placeholder state
//   const [restaurant, setRestaurant] = useState<any>({
//     name: "",
//     category: "",
//     rating: 0,
//     image: "/placeholder.jpg",
//     description: "",
//     menu: [],
//     location: { lat: 0, lng: 0 },
//   });

//   const [error, setError] = useState<string | null>(null);
//   const [imagesLoaded, setImagesLoaded] = useState(false);
//   const [favorites, setFavorites] = useState<number[]>([]); // array of favorite item ids

//  // fetch restaurant details with image preloading
// useEffect(() => {
//   const fetchRestaurant = async () => {
//     try {
//       const data = await getRestaurantDetails(id as string);

//       // check data
//       if (!data) {
//         setError("Failed to load restaurant details");
//         return;
//       }

//       // Preload hero image
//       const heroImg = new Image(); //create object in memory 
//       heroImg.src = data.image; // image url from api 
//       const heroPromise = new Promise<void>((resolve) => {
//         heroImg.onload = () => resolve();
//         heroImg.onerror = () => resolve(); // prevent blocking if image fails
//       });

//       // Preload menu images
//       const menuImgs =
//         data.menu?.map((item: any) => {
//           const img = new Image();
//           img.src = item.image;
//           return new Promise<void>((resolve) => {
//             img.onload = () => resolve();
//             img.onerror = () => resolve(); // prevent blocking if image fails
//           });
//         }) || []; // if data is undefined or null use empty array

//       // Wait for all images
//       await Promise.all([heroPromise, ...menuImgs]);

//       setRestaurant(data);
//       setImagesLoaded(true);
//     } catch {
//       setError("Failed to load restaurant details");
//     }
//   };

//   if (id) fetchRestaurant();
// }, [id]); 


//   // favorite handler
//   const handleToggleFavorite = (itemId: number) => {
//     setFavorites((prev) =>
//       prev.includes(itemId)
//         ? prev.filter((id) => id !== itemId)
//         : [...prev, itemId]
//     );
//   };

//   const handleAddToCart = (itemId: number) => {
//     console.log(`Added item ${itemId} to cart`);
//   };

//   const handleOrderNow = (itemId: number) => {
//     console.log(`Ordering item ${itemId} now`);
//   };

//   // Prevent blank screen with placeholders
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Container className="my-4">
//       {/* Hero Section */}
//       <div
//         className="restaurant-hero"
//         style={{
//           position: "relative",
//           width: "100%",
//           height: "300px",
//           borderRadius: "12px",
//           overflow: "hidden",
//           backgroundImage: imagesLoaded ? `url(${restaurant.image})` : undefined,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         {!imagesLoaded && <Placeholder xs={12} style={{ height: "300px" }} />}
//         <div
//           className="restaurant-hero-overlay"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             color: "white",
//             textAlign: "center",
//             padding: "0 20px",
//           }}
//         >
          
//           <h1>{restaurant.name}</h1>
//           <p>{restaurant.category}</p>
//           <p>
//             <i className="bi bi-star-fill text-warning"></i> {restaurant.rating}
//           </p>
//           <p>{restaurant.description}</p>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <h3 className="mt-4 mb-3">Menu</h3>
//       <Row className="g-3">
//         {!imagesLoaded
//           ? Array.from({ length: 3 }).map((_, i) => (
//             <Col md={4} key={i}>
//               <Placeholder as={MyCard} animation="glow" className="p-3">
//                 <Placeholder xs={12} bg="secondary" style={{ height: "180px" }} />
//                 <Placeholder xs={6} bg="secondary" className="mt-2" />
//                 <Placeholder xs={4} bg="secondary" className="mt-1" />
//               </Placeholder>
//             </Col>
//           ))
//           : restaurant.menu?.map((item: any) => {
//             const isFavorite = favorites.includes(item.id);
//             return (
//               <Col md={4} key={item.id}>
//                 <MyCard
//                   image={item.image}
//                   title={item.name}
//                   subtitle={`₹${item.price}`}
//                   height="180px"
//                 >
//                   {/* Buttons */}
//                   <div className="d-flex justify-content-between mt-3 menu-buttons">
//                     {/* Favorite Button */}
//                     <MyButton
//                       className={`theme-btn favorite-btn ${isFavorite ? "active" : ""
//                         }`}
//                       onClick={() => handleToggleFavorite(item.id)}
//                     >
//                       <i
//                         className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"
//                           }`}
//                       ></i>
//                     </MyButton>

//                     <MyButton
//                       className="theme-btn primary action-btn"
//                       onClick={() => handleAddToCart(item.id)}
//                     >
//                       <i className="bi bi-cart-fill"></i> Add to cart
//                     </MyButton>

//                     <MyButton
//                       className="theme-btn primary action-btn"
//                       onClick={() => handleOrderNow(item.id)}
//                     >
//                       <i className="bi bi-bag-fill"></i> Order now
//                     </MyButton>
//                   </div>
//                 </MyCard>
//               </Col>
//             );
//           })}
//       </Row>

//       {/* Restaurant Map */}
//       {restaurant.location && (
//         <div className="mt-4">
//           <h4 className="mb-3">Location</h4>

//           <div
//             style={{
//               width: "100%",
//               height: "300px",
//               borderRadius: "12px",
//               overflow: "hidden",
//             }}
//           >
//             <iframe
//               title="restaurant-map"
//               width="100%"
//               height="100%"
//               loading="lazy"
//               style={{ border: 0 }}
//               referrerPolicy="no-referrer-when-downgrade"
//               src={`https://www.google.com/maps?q=${restaurant.location.lat},${restaurant.location.lng}&output=embed`}
//             ></iframe>
//           </div>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default RestaurantDetails;
