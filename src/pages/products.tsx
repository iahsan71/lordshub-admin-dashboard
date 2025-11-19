import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  type: string;
  name: string;
  price: number;
  quantity: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [type, setType] = useState("Account");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  function resetForm() {
    setType("Account");
    setName("");
    setPrice("");
    setQuantity("");
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = {
      id: String(Date.now()),
      type,
      name,
      price: Number(price) || 0,
      quantity: Number(quantity) || 0,
    };
    setProducts((s) => [p, ...s]);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Products</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <Label>Type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              >
                <option>Account</option>
                <option>Gems</option>
                <option>Diamonds</option>
                <option>Bots</option>
              </select>
            </div>

            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Price</Label>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Button type="submit">Add product</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name || p.type}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Type: {p.type}</p>
              <p className="text-sm">Price: {p.price}</p>
              <p className="text-sm">Quantity: {p.quantity}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
