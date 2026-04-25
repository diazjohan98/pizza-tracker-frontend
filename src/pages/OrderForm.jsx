import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderForm() {
  const navigate = useNavigate();
  const [options, setOptions] = useState({ type: [], size: [] });
}
