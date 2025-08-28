import { Timestamp } from "firebase/firestore";

export function formatOrderDate(orderDate: string | Date | Timestamp) {
  if (orderDate instanceof Timestamp) {
    return orderDate.toDate().toLocaleDateString();
  }
  if (orderDate instanceof Date) {
    return orderDate.toLocaleDateString();
  }
  if (typeof orderDate === "string") {
    return new Date(orderDate).toLocaleDateString();
  }
  return "";
}

export function toJSDate(orderDate: any): Date {
  // Handle null or undefined
  if (!orderDate) {
    console.warn('toJSDate received null/undefined date, returning current date');
    return new Date();
  }
  
  if (orderDate?.toDate) {
    // Firestore Timestamp instance
    return orderDate.toDate();
  }
  if (orderDate instanceof Date) {
    return orderDate;
  }
  if (typeof orderDate === "string") {
    return new Date(orderDate);
  }
  if (orderDate?.seconds) {
    // Plain object version of a Timestamp
    return new Date(orderDate.seconds * 1000);
  }
  
  console.error('Unsupported date type:', orderDate, typeof orderDate);
  throw new Error(`Unsupported date type: ${typeof orderDate}`);
}
