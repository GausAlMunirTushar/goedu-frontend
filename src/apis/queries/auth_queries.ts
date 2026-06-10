import { userProfile } from "@/apis/endpoints/auth_apis";
import { useQuery } from "@/hooks/useQuery";
import type { User } from "@/apis/types/auth_type";
import type { TResponse } from "@/types/configs";

export const useProfileQuery = () => useQuery<TResponse<User>>(userProfile);
