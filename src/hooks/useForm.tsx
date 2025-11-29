import { useState, ChangeEvent, FormEvent } from 'react';

interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

interface UseFormProps {
  initialValues: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
  validate?: (values: FormValues) => FormErrors;
}

/**
 * Hook personnalisé pour gérer les formulaires
 * Gère les valeurs, erreurs, validation et soumission
 */
export const useForm = ({ initialValues, onSubmit, validate }: UseFormProps) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    // Valider le champ en temps réel si déjà touché
    if (touched[name] && validate) {
      const fieldErrors = validate({ ...values, [name]: value });
      setErrors({ ...errors, [name]: fieldErrors[name] || '' });
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    // Valider le champ au blur
    if (validate) {
      const fieldErrors = validate(values);
      setErrors({ ...errors, [name]: fieldErrors[name] || '' });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Valider tous les champs
    if (validate) {
      const formErrors = validate(values);
      setErrors(formErrors);
      
      if (Object.keys(formErrors).length > 0) {
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    isSubmitting,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
};
