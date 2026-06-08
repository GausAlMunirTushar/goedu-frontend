import { setup } from "@/apis/endpoints/dashboard_apis";
import { useQuery } from "@/hooks/useQuery";
import { SetupType } from "@/apis/types/dashboard_type";
import type { TResponse } from "@/types/configs";

export const useSetupQuery = () => useQuery<TResponse<SetupType>>(setup);
