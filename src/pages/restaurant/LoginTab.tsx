import { Row, Col } from "react-bootstrap";
import MyInput from "../../components/textfields/MyInput";
import { FIELD_LABELS,VALIDATION_RULES } from "./restaurantFormValidation";
import type { TabProps } from "./TabProps";


const LoginTab: React.FC<TabProps> = ({ register, errors }) => (
  <>
    <Row>
      <Col md={12}>
        <MyInput
          label={FIELD_LABELS.email}
          placeholder="Enter email / username"
          {...register("email", VALIDATION_RULES.email)}
          error={errors.email?.message}
          required
        />
      </Col>
    </Row>

    <Row>
      <Col md={12}>
        <MyInput
          label={FIELD_LABELS.password}
          type="password"
          placeholder="Enter password"
          {...register("password", VALIDATION_RULES.password)}
          error={errors.password?.message}
          required
        />
      </Col>
    </Row>

    <Row>
      <Col md={12}>
        <MyInput
          label={FIELD_LABELS.confirmPassword}
          type="password"
          placeholder="Re-enter password"
          {...register(
            "confirmPassword",
            VALIDATION_RULES.confirmPassword
          )}
          error={errors.confirmPassword?.message}
          required
        />
      </Col>
    </Row>
  </>
);

export default LoginTab;
