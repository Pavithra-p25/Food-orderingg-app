import { Row, Col } from "react-bootstrap";
import MyInput from "../../components/textfields/MyInput";
import MyDropdown from "../../components/textfields/MyDropdown";
import { FIELD_LABELS, VALIDATION_RULES } from "./restaurantFormValidation";
import type { TabProps } from "./TabProps";


const RestaurantTab: React.FC<TabProps> = ({ register, errors }) => (
  <>
    <Row>
      <Col md={6}>
        <MyInput
          label={FIELD_LABELS.restaurantName}
          placeholder="Enter restaurant name"
          {...register(
            "restaurantName",
            VALIDATION_RULES.restaurantName
          )}
          error={errors.restaurantName?.message}
          required
        />
      </Col>

      <Col md={6}>
        <MyDropdown
          label={FIELD_LABELS.restaurantType}
          options={["Veg", "Non-Veg", "Both"]}
          {...register(
            "restaurantType",
            VALIDATION_RULES.restaurantType
          )}
          error={errors.restaurantType?.message}
          required
        />
      </Col>
    </Row>

    <Row>
      <Col md={6}>
        <MyDropdown
          label={FIELD_LABELS.category}
          options={[
            "Indian",
            "Chinese",
            "Fast Food",
            "Italian",
            "Mexican",
          ]}
          {...register("category", VALIDATION_RULES.category)}
          error={errors.category?.message}
          required
        />
      </Col>

      <Col md={6}>
        <MyInput label="Upload Logo" type="file" />
      </Col>
    </Row>

    <Row>
      <Col md={6}>
        <MyInput label="Opening Time" type="time" />
      </Col>

      <Col md={6}>
        <MyInput label="Closing Time" type="time" />
      </Col>
    </Row>

    <Row>
      <Col md={6}>
        <MyDropdown
          label="Average Delivery Time"
          options={["20 mins", "30 mins", "45 mins"]}
        />
      </Col>

      <Col md={6}>
        <MyInput
          label="Website / Social Link"
          type="url"
          placeholder="Enter your website link"
        />
      </Col>
    </Row>
  </>
);

export default RestaurantTab;
