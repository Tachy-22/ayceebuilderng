"use client";

import PasscodeProtection from "@/components/PasscodeProtection";

interface AdminWrapperProps {
  children: React.ReactNode;
}

const AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  return <PasscodeProtection>{children}</PasscodeProtection>;
};

export default AdminWrapper;
