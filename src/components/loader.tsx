import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="h-10 w-10 border-8 border-solid border-primary animate-spin rounded-full border-t-transparent"></div>
    </div>
  );
}

export default Loader;
