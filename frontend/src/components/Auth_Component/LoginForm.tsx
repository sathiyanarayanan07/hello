// React
import { useState } from "react";
import { useForm } from "react-hook-form";
// Icons & Animation
import { LogIn, Mail, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Components & UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Form Validation
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { UseFormRegister } from "react-hook-form";

// -------------------------------- Types --------------------------------------
export interface InputFieldProps {
  field: keyof typeof fieldConfig; // key name of the field (e.g., "email" or "password")
  register: UseFormRegister<LoginFormData>; // React Hook Form's register function
  error?: string; // optional validation error message
}

export interface LoginFormProps {
  onLogin: (data: LoginFormData) => void;
  isLoading?: boolean;
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

// ----------------------------- Field Config -----------------------------------
const fieldConfig = {
  email: {
    label: "Email Address",
    placeholder: "unknown@thirdvizion.com",
    icon: Mail,
    type: "email",
  },
  employeeId: {
    label: "Employee ID",
    placeholder: "VIZ001",
    icon: User,
    type: "text",
  },
};

// --------------------------- Validation Schema -------------------------------
const createLoginSchema = (loginType: "email" | "employeeId") =>
  z.object({
    email:
      loginType === "email"
        ? z.string().min(1, "Email is required").email("Invalid email address")
        : z.string().optional(),
    employeeId:
      loginType === "employeeId"
        ? z.string().min(1, "Employee ID is required")
        : z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

// --------------------------- Email / Employee ID Input Field Component ------------------------------
function InputField({ field, register, error }: InputFieldProps) {
  const { label, placeholder, icon: Icon, type } = fieldConfig[field];

  return (
    <motion.div
      key={field}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Label htmlFor={field}>{label}</Label>
      <div className="relative">
        <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          id={field}
          type={type}
          placeholder={placeholder}
          className="pl-9"
          {...register(field)}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </motion.div>
  );
}

// --------------------------- Main Login Form Component ------------------------------
export function LoginForm({ onLogin, isLoading = false }: LoginFormProps) {
  const [loginType, setLoginType] = useState<"email" | "employeeId">("email");
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(loginType)),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "", employeeId: "", password: "" },
    criteriaMode: "firstError",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = form;

  const switchLoginType = (type: "email" | "employeeId") => {
    setLoginType(type);
    setValue(type === "email" ? "employeeId" : "email", "");
    clearErrors();
  };

  const onSubmit = (data: LoginFormData) => {
    const loginData = { ...data } as Partial<LoginFormData>;

    if (loginType === "email") {
      delete loginData.employeeId;
    } else {
      delete loginData.email;
    }

    onLogin(loginData as LoginFormData);
  };

  return (
    <Card className="w-full max-w-md shadow-medium">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center">
          <img src="/logo.png" alt="logo" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Sign In
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your attendance dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Login Type Toggle */}
        <div className="flex space-x-2 p-2 bg-muted rounded-full">
          {(["email", "employeeId"] as const).map((type) => {
            const Icon = type === "email" ? Mail : User;
            return (
              <Button
                key={type}
                type="button"
                variant={loginType === type ? "hero" : "ghost"}
                size="sm"
                className="flex-1 rounded-full hover:bg-orange-400 hover:text-white"
                onClick={() => switchLoginType(type)}
              >
                <Icon className="w-5 h-5 mr-1" />
                {type === "email" ? "Email" : "Employee ID"}
              </Button>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, (errs) => {
            toast({
              title: "Validation Error",
              description: "Please check the form for errors.",
              className:
                "bg-orange-400 text-white border border-orange-400 rounded-md shadow-lg",
            });
          })}
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            <InputField
              field={loginType}
              register={register}
              error={errors[loginType]?.message?.toString()}
            />
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-9"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Having trouble? Contact your system administrator
        </div>
      </CardContent>
    </Card>
  );
}
