import { useEffect } from 'react';

export const useLogIfVariableChanges = (
  variableName: string,
  variable: any
) => {
  useEffect(() => {
    console.log(`${variableName} changed:`, variable);
  }, [variable, variableName]);
};
