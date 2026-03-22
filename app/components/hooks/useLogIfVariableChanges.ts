import { useEffect } from 'react';

export const useLogIfVariableChanges = (
  variableName: string,
  variable: unknown
) => {
  useEffect(() => {
    console.log(`${variableName} changed:`, variable);
  }, [variable, variableName]);
};
