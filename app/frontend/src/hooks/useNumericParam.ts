import { useParams } from 'react-router-dom';

export function useNumericParam(paramName = 'id') {
    const params = useParams();
    const value = params[paramName];

    if (!value || !/^\d+$/.test(value)) {
        return null; // invalid or missing
    }

    const numericValue = Number(value);

    if (numericValue > Number.MAX_SAFE_INTEGER) {
        return null; // forbid very big values
    }
    return numericValue;
}
