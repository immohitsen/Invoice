"use client";
import React, { useState, useEffect } from "react";
import { X, Download, Trash2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "./ui/InvoicePDF";

type LineItem = {
  id: number;
  description: string;
  qty: number;
  rate: number;
};

// Helper function to convert base64 to File
const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default function InvoiceForm() {

  // Initialize all states with empty/default values
  const [logo, setLogo] = useState<File | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("1");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentTerms, setPaymentTerms] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: Date.now(), description: "", qty: 0, rate: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [taxType, setTaxType] = useState<"percent" | "amount">("percent");
  const [taxPercent, setTaxPercent] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [currency, setCurrency] = useState("INR");

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("invoiceDraft");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // Set form fields
        setFromName(parsedData.fromName || "");
        setFromAddress(parsedData.fromAddress || "");
        setToName(parsedData.toName || "");
        setToAddress(parsedData.toAddress || "");
        setInvoiceNumber(parsedData.invoiceNumber || "1");
        setDate(parsedData.date || new Date().toISOString().slice(0, 10));
        setPaymentTerms(parsedData.paymentTerms || "");
        setDueDate(parsedData.dueDate || "");
        setPoNumber(parsedData.poNumber || "");
        setItems(
          parsedData.items || [
            { id: Date.now(), description: "", qty: 0, rate: 0 },
          ]
        );
        setNotes(parsedData.notes || "");
        setTerms(parsedData.terms || "");
        setTaxType(parsedData.taxType || "percent");
        setTaxPercent(parsedData.taxPercent || 0);
        setTaxAmount(parsedData.taxAmount || 0);
        setDiscount(parsedData.discount || 0);
        setShippingFee(parsedData.shippingFee || 0);
        setAmountPaid(parsedData.amountPaid || 0);
        setCurrency(parsedData.currency || "INR");

        // Set logo if exists
        if (parsedData.logoBase64) {
          const file = base64ToFile(parsedData.logoBase64, "logo");
          setLogo(file);
        }
      } catch (error) {
        console.error("Failed to parse saved data:", error);
      }
    }
  }, []);

  // Save form data to localStorage with debounce
  useEffect(() => {
    const saveDraft = async () => {
      let logoBase64 = null;

      if (logo) {
        logoBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(logo);
        });
      }

      const formData = {
        fromName,
        fromAddress,
        toName,
        toAddress,
        invoiceNumber,
        date,
        paymentTerms,
        dueDate,
        poNumber,
        items,
        notes,
        terms,
        taxType,
        taxPercent,
        taxAmount,
        discount,
        shippingFee,
        amountPaid,
        currency,
        logoBase64,
      };

      localStorage.setItem("invoiceDraft", JSON.stringify(formData));
    };

    const timer = setTimeout(() => {
      saveDraft();
    }, 1000); // Debounce saving to 1 second

    return () => clearTimeout(timer);
  }, [
    fromName,
    fromAddress,
    toName,
    toAddress,
    invoiceNumber,
    date,
    paymentTerms,
    dueDate,
    poNumber,
    items,
    notes,
    terms,
    taxType,
    taxPercent,
    taxAmount,
    discount,
    shippingFee,
    amountPaid,
    currency,
    logo,
  ]);

  const handleDownloadClick = async () => {
    // 1️⃣ Convert logo to base64 if present
    let logoBase64: string | null = null;
    if (logo) {
      logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(logo);
        reader.onload = () => resolve(reader.result as string);
      });
    }

    // 2️⃣ Assemble invoice data
    const invoiceData = {
      fromName,
      fromAddress,
      toName,
      toAddress,
      invoiceNumber,
      date,
      dueDate,
      items,
      subtotal,
      taxValue,
      discountAmt,
      shippingFee,
      total,
      amountPaid,
      balanceDue,
      currency,
      logo: logoBase64 || undefined,
      notes,
      // terms is not used in InvoicePDF, so not passing it
    };

    // 3️⃣ Generate PDF and open in new tab
    const blob = await pdf(<InvoicePDF data={invoiceData} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // Helpers
  const addLine = () =>
    setItems([...items, { id: Date.now(), description: "", qty: 0, rate: 0 }]);

  const deleteLine = (id: number) =>
    setItems(items.filter((it) => it.id !== id));

  const updateItem = (id: number, field: keyof LineItem, val: string) =>
    setItems((its) =>
      its.map((it) =>
        it.id === id
          ? { ...it, [field]: field === "description" ? val : Number(val) }
          : it
      )
    );

  // Totals
  const subtotal = items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  const taxValue =
    taxType === "percent" ? (subtotal * taxPercent) / 100 : taxAmount;
  const discountAmt = (subtotal * discount) / 100;
  const total = subtotal + taxValue + shippingFee - discountAmt;
  const balanceDue = total - amountPaid;

  // Clear saved draft
  const clearDraft = () => {
    localStorage.removeItem("invoiceDraft");
    alert("Saved draft has been cleared!");
    setLogo(null);
    setInvoiceNumber("");
    setDate("");
    setPaymentTerms("");
    setDueDate("");
    setPoNumber("");
    setFromName("");
    setFromAddress("");
    setToName("");
    setToAddress("");
    setItems([
      { id: Date.now(), description: "", qty: 0, rate: 0 },
    ]);
    setNotes("");
    setTerms("");
    setTaxType("percent");
    setTaxPercent(0);
    setTaxAmount(0);
    setDiscount(0);
    setShippingFee(0);
    setAmountPaid(0);
    setCurrency("INR");
  };

  return (
    <div className="font-montserrat min-h-screen bg-neutral-950 p-6">
      <div className="max-w-6xl mx-auto bg-neutral-900 rounded-2xl overflow-hidden shadow-lg">
        <div className="grid lg:grid-cols-[2fr_1fr]">
          {/* LEFT */}
          <div className="p-8 space-y-6">
            {/* Logo & Invoice# */}
            <div className="flex justify-between items-center">
              <label className="cursor-pointer contain-inline-size items-center gap-2 relative">
                <div className="h-48 w-48 bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden border border-gray-500 border-dashed">
                  {logo ? (
                    <>
                      <img
                        src={URL.createObjectURL(logo)}
                        alt="logo"
                        className="h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLogo(null);
                        }}
                        className="absolute top-[-10px] right-[-10px] bg-neutral-700/80 hover:bg-neutral-600/80 rounded-full p-1"
                        title="Remove logo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-neutral-500">Logo</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files?.[0] || null)}
                  className="inline-block text-sm text-neutral-400"
                />
              </label>
              <div className="space-y-1 text-left">
                <label className="text-sm mx-1 text-neutral-400">Invoice</label>
                <div className="relative w-32">
                  <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400 pointer-events-none">
                    #
                  </span>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 bg-neutral-900 text-center text-white border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                    placeholder="1"
                  />
                </div>
              </div>
            </div>

            {/* Dates & Terms */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Date", value: date, setter: setDate, type: "date" },
                {
                  label: "Payment Terms",
                  value: paymentTerms,
                  setter: setPaymentTerms,
                  type: "text",
                  placeholder: "e.g. Net 15",
                },
                {
                  label: "Due Date",
                  value: dueDate,
                  setter: setDueDate,
                  type: "date",
                },
                {
                  label: "PO Number",
                  value: poNumber,
                  setter: setPoNumber,
                  type: "text",
                },
              ].map((fld) => (
                <div key={fld.label}>
                  <label className="text-sm text-neutral-400">
                    {fld.label}
                  </label>
                  <input
                    type={fld.type}
                    value={fld.value}
                    placeholder={fld.placeholder}
                    onChange={(e) => fld.setter(e.target.value)}
                    className="w-full bg-neutral-800 px-3 py-2 rounded-md border border-neutral-700 text-white"
                  />
                </div>
              ))}
            </div>

            {/* From & To */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-400">From (Name)</label>
                <input
                  type="text"
                  value={fromName}
                  placeholder="Who is this from?"
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full text-sm bg-neutral-800 mb-2 px-3 py-2 rounded-md border border-neutral-700 text-white"
                />
                <label className="mt-2 text-sm text-neutral-400">Address</label>
                <textarea
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-neutral-800 px-3 py-2 rounded-md border border-neutral-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400">To (Name)</label>
                <input
                  type="text"
                  value={toName}
                  placeholder="Who is this to?"
                  onChange={(e) => setToName(e.target.value)}
                  className="w-full text-sm bg-neutral-800 mb-2 px-3 py-2 rounded-md border border-neutral-700 text-white"
                />
                <label className="mt-2 text-sm text-neutral-400">Address</label>
                <textarea
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-neutral-800 px-3 py-2 rounded-md border border-neutral-700 text-white"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Items</label>
              {items.map((it) => (
                <div key={it.id} className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={it.description}
                    onChange={(e) =>
                      updateItem(it.id, "description", e.target.value)
                    }
                    placeholder="Description..."
                    className="flex-1 bg-neutral-800 px-3 py-2 rounded-md border border-neutral-700 text-white"
                  />
                  <input
                    type="number"
                    value={it.qty === 0 ? "" : it.qty}
                    onChange={(e) => updateItem(it.id, "qty", e.target.value)}
                    placeholder="Qty"
                    className="w-20 bg-neutral-800 px-3 py-2 rounded-md border border-neutral-700 text-white text-center"
                  />
                  <input
                    type="number"
                    value={it.rate === 0 ? "" : it.rate}
                    onChange={(e) => updateItem(it.id, "rate", e.target.value)}
                    placeholder="Rate"
                    className="w-24 bg-neutral-800 px-3 py-2 rounded-md border border-neutral-700 text-white text-center"
                  />
                  <span className="w-24 py-2 text-center font-medium">
                    {currency}{" "}
                    {(it.qty * it.rate).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  {items.length > 1 && (
                    <button
                      onClick={() => deleteLine(it.id)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addLine}
                className="cursor-pointer mt-2 text-green-500 font-semibold"
              >
                + Line Item
              </button>
            </div>

            {/* Notes & Terms */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-800 px-3 py-2 rounded-md border border-neutral-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400">Terms</label>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-800 px-3 py-2 rounded-md border border-neutral-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-neutral-800 p-6 border-l border-neutral-700 flex flex-col gap-6">
            {/* Currency & Save */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-neutral-900 px-3 py-2 rounded-md border border-neutral-700 text-white"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            {/* Tax Toggle */}
            <div className="space-y-1">
              <span className="text-sm text-neutral-400">Tax</span>
              <div className="flex gap-2 items-center">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={taxType === "percent"}
                    onChange={() => setTaxType("percent")}
                    className="accent-yellow-400"
                  />
                  %
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={taxType === "amount"}
                    onChange={() => setTaxType("amount")}
                    className="accent-yellow-400"
                  />
                  flat
                </label>
                {taxType === "percent" ? (
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-20 bg-neutral-900 px-2 py-1 rounded-md border border-neutral-700 text-white text-right"
                  />
                ) : (
                  <input
                    type="number"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(Number(e.target.value))}
                    className="w-24 bg-neutral-900 px-2 py-1 rounded-md border border-neutral-700 text-white text-right"
                  />
                )}
              </div>
              <div className="text-right text-white/70 text-sm">
                {currency}{" "}
                {taxValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            {/* Discount & Shipping */}
            {[
              {
                label: "Discount %",
                val: discount,
                set: setDiscount,
                width: "w-20",
              },
              {
                label: "Shipping",
                val: shippingFee,
                set: setShippingFee,
                width: "w-24",
              },
            ].map((fld) => (
              <div
                key={fld.label}
                className="flex justify-between items-center"
              >
                <label className="text-sm text-neutral-400">{fld.label}</label>
                <input
                  type="number"
                  value={fld.val}
                  onChange={(e) => fld.set(Number(e.target.value))}
                  className={`${fld.width} bg-neutral-900 px-2 py-1 rounded-md border border-neutral-700 text-white text-right`}
                />
              </div>
            ))}

            {/* Totals */}
            <div className="border-t border-neutral-700 pt-4 space-y-2 text-sm text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {currency}{" "}
                  {subtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>
                  {currency}{" "}
                  {taxValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>
                  − {currency}{" "}
                  {discountAmt.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {currency}{" "}
                  {shippingFee.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-white text-base">
                <span>Total</span>
                <span>
                  {currency}{" "}
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Amount Paid</span>
                <div className="flex items-center gap-2">
                  <span>{currency}</span>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-24 bg-neutral-900 px-2 py-1 rounded-md border border-neutral-700 text-white text-right"
                  />
                </div>
              </div>
              <div className="flex justify-between font-medium">
                <span>Balance Due</span>
                <span>
                  {currency}{" "}
                  {balanceDue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Download */}
            <button
              onClick={handleDownloadClick}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>

            {/* Clear Draft Button */}
            <button
              onClick={clearDraft}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Clear Saved Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
