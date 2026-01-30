import { TextField} from "@mui/material";
import type { TextFieldProps } from "@mui/material";

type CommonInputProps = TextFieldProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CommonInput: React.FC<CommonInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      fullWidth
      size="small"
      {...props}
    />
  );
};

export default CommonInput;
