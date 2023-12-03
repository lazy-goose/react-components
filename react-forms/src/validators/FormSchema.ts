import * as yup from 'yup';
import { FormElements as F } from '../constants/formElements';
import countries from '../constants/countries';

const FormSchema = yup.object({
  [F.name.field]: yup
    .string()
    .required(F.name.error.required)
    .matches(/^\p{Lu}/u, { message: F.name.error.firstUppercase }),
  [F.age.field]: yup
    .number()
    .typeError(F.age.error.positiveNumber)
    .required(F.age.error.required)
    .positive(F.age.error.positiveNumber),
  [F.email.field]: yup
    .string()
    .required(F.email.error.required)
    .min(1, F.email.error.required)
    .email(F.email.error.email),
  [F.passwords.field.new]: yup
    .string()
    .required(F.passwords.error.required)
    .matches(/\d/, F.passwords.error.oneNumber)
    .matches(/\p{Lu}/u, F.passwords.error.oneUppercase)
    .matches(/\p{Ll}/u, F.passwords.error.oneLowerCase)
    .matches(/[!+@#$%^&*()\-_"=+{}; :,<.>]/, F.passwords.error.oneSpecial),
  [F.passwords.field.retype]: yup
    .string()
    .required(F.passwords.error.match)
    .oneOf([yup.ref(F.passwords.field.new)], F.passwords.error.match),
  [F.gender.field]: yup.string().required(F.gender.error.required),
  [F.terms.field]: yup
    .string()
    .required(F.terms.error.required)
    .oneOf(['true'], F.terms.error.required),
  [F.picture.field]: yup
    .mixed<File>()
    .required(F.picture.error.required)
    .transform((f) => {
      return f instanceof FileList ? f[0] : f;
    })
    .test('pictureRequired', F.picture.error.required, (f) => {
      const file = f as File | undefined;
      return !!file?.name?.length && (file?.size || 0) > 0;
    })
    .test('pictureKnownExt', F.picture.error.extension('png', 'jpg'), (f) => {
      const file = f as File | undefined;
      return ['image/png', 'image/jpeg'].includes(file?.type || '');
    })
    .test('pictureMaxSize', F.picture.error.size('5MB'), (f) => {
      const file = f as File | undefined;
      return (file?.size || 0) <= 5.243e6;
    }),
  [F.country.field]: yup
    .string()
    .required(F.country.error.required)
    .oneOf(
      countries.map((c) => c.name),
      F.country.error.required
    ),
});

type FormSchemaType = yup.InferType<typeof FormSchema>;

export { type FormSchemaType };
export default FormSchema;