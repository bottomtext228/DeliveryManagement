import { useMutation } from "@tanstack/react-query";
import { setPickUpPoints } from "../../api/pickUpPoint/setPickUpPoints";
import { queryClient } from "../../queryClient";

export const useSetPickUpPoints = () => useMutation({
    mutationFn: setPickUpPoints,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pickuppoints'] });
    }
});