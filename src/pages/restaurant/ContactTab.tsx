import { Row, Col } from "react-bootstrap";
import MyInput from "../../components/textfields/MyInput";
import { FIELD_LABELS,VALIDATION_RULES } from "./restaurantFormValidation";

import type { TabProps } from "./TabProps";

const ContactTab: React.FC<TabProps> = ({ register, errors }) => (
  <>
    <Row>
      <Col md={6}>
        <MyInput
          label={FIELD_LABELS.ownerName}
          placeholder="Enter your name"
          {...register(
            "ownerName",
            VALIDATION_RULES.ownerName
          )}
          error={errors.ownerName?.message}
          required
        />
      </Col>

      <Col md={6}>
        <MyInput
          label={FIELD_LABELS.supportEmail}
          placeholder="Enter email"
          {...register(
            "supportEmail",
            VALIDATION_RULES.supportEmail
          )}
          error={errors.supportEmail?.message}
          required
        />
      </Col>
    </Row>

    <Row>
      <Col md={6}>
        <MyInput
          label={FIELD_LABELS.phone}
          placeholder="Enter phone no"
          {...register("phone", VALIDATION_RULES.phone)}
          error={errors.phone?.message}
          required
        />
      </Col>

      <Col md={6}>
        <MyInput
          label={FIELD_LABELS.alternatePhone}
          placeholder="Alternate phone no"
        />
      </Col>
    </Row>
  </>
);

export default ContactTab;
