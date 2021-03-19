import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import db from "../firebase";
import "./PlansScreen.css";
import { loadStripe } from "@stripe/stripe-js"

const PlansScreen = () => {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);

  console.log(products);

  const loadCheckout = async (priceId) => {
    const docRef = await db.collection("customers").doc(user.uid).collection("checkout_sessions").add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    });
    docRef.onSnapshot(async(snap) => {
        const { error, sessionId } = snap.data();
        if (error) {
            // Show an error to your customer and 
            // inspect your Cloud Function logs in the Firebase console. 
            alert(`An error occurred: ${error.message}`);
        }

        if (sessionId) {
            // We have a session, let's redirect to Checkout
            // Init Stripe
            const stripe = await loadStripe("pk_test_51IWhVgAs9EZG0DNXqqhGZJSyU13wlN78YyWVvSr3lswoJvo1Aw7ql1hUY034D83OPVXXIdVrh5lfQ7bzav6Mr7cf00UKRpCg4j");
            stripe.redirectToCheckout({sessionId});
        }
    })
  };

  return (
    <div className="plansScreen">
      {Object.entries(products).map(([productId, productData]) => {
        //TODO: add some logic to check if the user's subscription is active...
        return (
          <div className="plansScreen_plan">
            <div className="plansScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => loadCheckout(productData.prices.priceId)}>
              Subscribe
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PlansScreen;
