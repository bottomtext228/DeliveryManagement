import { useMutation } from "@tanstack/react-query";
import { updateCompanyDetails } from "../../api/company/updateCompanyDetails";
import useUserStore from "../../store/user/userStore";

export const useUpdateCompanyDetails = () => useMutation({
    mutationFn: updateCompanyDetails,
    onMutate: (details) => {
        useUserStore.getState().updateCompany(details);
    }
});