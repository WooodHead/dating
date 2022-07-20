import Slider, { SliderTooltip, Handle } from 'rc-slider';
import { Controller } from "react-hook-form";

function RangePickerField(
  {
    label,
    value,
    onChange,
    error = false,
    helperText,
    startPoint,
    endPoint,
    ...rest
  }
) {
  const marksStyles = {
    color: 'rgba(84, 84, 75, 0.5)',
    fontFamily: 'Gilroy',
    fontSize: '16px'
  };

  const handleStyles = {
    background: '#D0AB5E',
    borderColor: '#D0AB5E',
    boxShadow: 'none'
  };

  const trackStyles = {
    backgroundColor: '#D0AB5E'
  };

  const railStyles = {
    backgroundColor: '#54544B'
  };

  const activeDotStyle = {
    borderColor: '#D0AB5E'
  };

  const dotStyle = {
    borderColor: '#54544B'
  };

  const marks = {
    [startPoint]: {
      value: startPoint,
      style: marksStyles,
      label: <div className="text-nowrap">{startPoint}</div>,
    },
    [endPoint]: {
      value: endPoint,
      style: marksStyles,
      label: <div className="text-nowrap">{endPoint}</div>,
    },
  };

  const handle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
      <SliderTooltip
        prefixCls="rc-slider-tooltip"
        overlay={`${value} km`}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </SliderTooltip>
    );
  };

  return (
    <div className="pt-2 px-1">
      <Slider
        allowCross={false}
        min={startPoint}
        max={endPoint}
        step={1}
        value={value}
        defaultValue={value}
        marks={marks}
        dotStyle={dotStyle}
        activeDotStyle={activeDotStyle}
        tipFormatter={value => `${value} km`}
        handle={handle}
        trackStyle={[trackStyles]}
        handleStyle={[handleStyles, handleStyles]}
        railStyle={railStyles}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
};

function RangePicker(
  {
    label,
    name,
    control,
    options,
    ...rest
  }
) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <RangePickerField
          label={label}
          value={value || ''}
          onChange={onChange}
          error={!!error}
          helperText={error?.message ?? ''}
          options={options}
          {...rest}
        />
      )}
    />
  );
}

export default RangePicker;
