import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="h-80 flex justify-center items-center">
      <Loader2 className="  w-full  animate-spin" />
    </div>
  );
};

export default Loading;
