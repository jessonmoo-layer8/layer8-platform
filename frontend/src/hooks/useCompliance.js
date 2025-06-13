import { useState, useEffect } from 'react';

export function useCompliance() {
  const [compliance, setCompliance] = useState(null);

  useEffect(() => {
    fetch('/api/compliance')
      .then(res => res.json())
      .then(setCompliance);
  }, []);

  return compliance;
}
