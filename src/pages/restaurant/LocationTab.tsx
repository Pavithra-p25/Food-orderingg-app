import { Row, Col } from "react-bootstrap";
import MyTextarea from "../../components/textfields/MyTextarea";
import MyInput from "../../components/textfields/MyInput";
import { FIELD_LABELS,VALIDATION_RULES } from "./restaurantFormValidation";
import type { TabProps } from "./TabProps";

const LocationTab: React.FC<TabProps> = ({ register, errors }) => (
  <>
    <Row>
      <Col md={12}>
        <MyTextarea
          label="Street / Address"
          placeholder="Enter full address"
          {...register("address", VALIDATION_RULES.address)}
          error={errors.address?.message}
          required
        />
      </Col>
    </Row>

    <Row>
      <Col md={6}>
        <MyInput
          label={FIELD_LABELS.city}
          placeholder="Enter city"
          {...register("city", VALIDATION_RULES.city)}
          error={errors.city?.message}
          required
        />
      </Col>

      <Col md={6}>
        <MyInput
          label={FIELD_LABELS.state}
          placeholder="Enter state"
          {...register("state", VALIDATION_RULES.state)}
          error={errors.state?.message}
          required
        />
      </Col>
    </Row>

    <Row>
      <Col md={6}>
        <MyInput
          label={FIELD_LABELS.country}
          placeholder="Enter country"
          {...register(
            "country",
            VALIDATION_RULES.country
          )}
          error={errors.country?.message}
        />
      </Col>

      <Col md={6}>
        <MyInput
          label={FIELD_LABELS.pincode}
          placeholder="Enter pincode"
          {...register(
            "pincode",
            VALIDATION_RULES.pincode
          )}
          error={errors.pincode?.message}
        />
      </Col>
    </Row>
  </>
);

export default LocationTab;
