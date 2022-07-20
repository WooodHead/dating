import React from "react";
import AmericaExpress from "./AmericaExpress";
import Diners from "./Diners";
import Discover from "./Discover";
import Elo from "./Elo";
import Generic from "./Generic";
import Hiper from "./Hiper";
import HiperCard from "./HiperCard";
import MasterCard from "./MasterCard";
import Maestro from "./Maestro";
import Visa from "./Visa";

export default function CreditCardIcon({ brand, width }) {
  switch (brand) {
    case "visa":
      return <Visa width={`${width}px`} />;
    case "mastercard":
      return <MasterCard width={`${width}px`} />;
    case "american-express":
      return <AmericaExpress width={`${width}px`} />;
    case "discover":
      return <Discover width={`${width}px`} />;
    case "diners-club":
      return <Diners width={`${width}px`} />;
    case "maestro":
      return <Maestro width={`${width}px`} />;
    case "elo":
      return <Elo width={`${width}px`} />;
    case "hiper":
      return <Hiper width={`${width}px`} />;
    case "hipercard":
      return <HiperCard width={`${width}px`} />;
    case "mir":
    case "unionpay":
    case "jcb":
    default:
      return <Generic width={`${width}px`} />;
  }
}
