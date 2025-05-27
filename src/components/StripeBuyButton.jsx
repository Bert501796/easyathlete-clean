// // components/StripeBuyButton.jsx

//Fake payment button
import React from 'react';

export default function StripeBuyButton() {
  const handleFakePayment = () => {
    localStorage.setItem('has_paid', 'true');
    window.postMessage('stripe_payment_success', '*');
    window.location.reload(); // Reload to trigger the `hasPaid` logic
  };

  return (
    <div className="text-center">
      <button
        onClick={handleFakePayment}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        🔓 Simulate Payment Success
      </button>
      <p className="text-sm text-gray-500 mt-2">(Test mode — payment is bypassed)</p>
    </div>
  );
}

// real payment button
// import React, { useEffect, useRef } from 'react';

// export default function StripeBuyButton() {
//   const containerRef = useRef();

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://js.stripe.com/v3/buy-button.js';
//     script.async = true;
//     containerRef.current.appendChild(script);
//   }, []);

//   return (
//     <div ref={containerRef}>
//       <stripe-buy-button
//         buy-button-id="buy_btn_1RReWbQdIQrSu0g6bgHVDOCT"
//         publishable-key="pk_test_51RReMiQdIQrSu0g6EqJ33OUUy97KO6Nq5xtO2VOmlknhrca0RXD99aClbi00bYuTOzZmXjHWnjuqQ1YhORVhutWM00I3IYPOUF"
//       ></stripe-buy-button>
//     </div>
//   );
// }


