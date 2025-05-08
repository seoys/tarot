"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email({ message: "올바른 이메일을 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMsg("");
    try {
      // TODO: 여기에 실제 로그인 로직 추가 (예: Firebase, Supabase 등)
      console.log("로그인 시도:", data);
      // 성공 시 라우팅
      router.push("/dashboard");
    } catch (error) {
      console.error("로그인 에러:", error);
      setErrorMsg("로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-6 border rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="이메일" type="email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Input placeholder="비밀번호" type="password" {...register("password")} />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </div>
  );
}
