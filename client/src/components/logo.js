import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

export const Logo = styled((props) => {
  const { variant, ...other } = props;

  const color = variant === "light" ? "#C1C4D6" : "#5048E5";

  return (
    <svg
      class="gh__logo__svg"
      width="100px"
      height="20px"
      viewBox="0 0 786 113"
      xmlns="http://www.w3.org/2000/svg"
      fill-rule="evenodd"
      clip-rule="evenodd"
      stroke-linejoin="round"
      stroke-miterlimit="1.414"
      // {...other}
    >
      <title></title>
      <path
        d="M205.355 7.125c-1.31-2.63-4.78-4.77-7.72-4.77h-5.98c-2.93 0-6.37 2.17-7.64 4.82l-47.39 99c-1.32 2.62.11 4.49 3.05 4.49h10.95c4.32 0 6.3-1.96 7.47-4.37 1.18-2.41 3.78-7.65 4.28-8.71.67-1.45 2.76-2.33 5.69-2.33l50.99.03c2.94.01 4.83.56 5.7 2.3.57 1.13 3.17 5.84 4.45 8.41 1.29 2.57 3.46 4.68 7.67 4.68h15.89c2.94 0 4.22-2.23 3.17-4.3-1.04-2.09-50.58-99.25-50.58-99.25zm-29.94 72.83c-2.94 0-4.32-2.19-3.08-4.84l18.67-40c1.24-2.66 3.25-2.65 4.46.02l18.18 40c1.21 2.67-.2 4.85-3.13 4.85l-35.1-.03zm396.11-72.07v98.22c0 2.7 2.4 4.56 5.34 4.56h12.95c2.94 0 5.34-1.87 5.34-4.81V7.695c0-2.94-1.9-5.34-4.83-5.34h-13.46c-2.93-.01-5.34 1.8-5.34 5.53zm-217 61.52c-1.69-2.4-.76-5.06 2.05-5.9 0 0 11.19-3.35 16.55-8.15 5.36-4.82 8.05-11.77 8.05-20.83 0-5.93-1.04-10.91-3.1-14.96-2.06-4.04-5.02-7.35-8.87-9.88-3.85-2.54-8.45-4.41-13.82-5.58-5.37-1.16-12.62-1.5-12.62-1.5-2.94-.13-7.74-.24-10.67-.24h-53.78c-2.93 0-5.34 2.4-5.34 5.34v98.16c0 2.94 2.4 4.81 5.34 4.81h12.73c2.94 0 5.34-1.87 5.34-4.81 0 0 .01-39.04.03-39.04.02 0 .04-.02.04-.05 0-.03 24.12-.06 24.12-.06 2.93 0 6.72 1.96 8.42 4.37l25.04 35.26c2.33 3.12 4.54 4.34 7.48 4.34h16.63c2.94 0 3.4-2.77 2.38-4.21-1-1.45-26-37.07-26-37.07zm-10.13-19.94c-3.3.76-7.01.91-7.01.91-2.93.13-7.73.23-10.67.23h-24.93c-2.94 0-5.34-2.4-5.34-5.34v-19.89c0-2.94 2.4-5.34 5.34-5.34h24.93c2.94 0 7.74.11 10.67.23 0 0 3.71.15 7.01.91s5.91 1.82 7.82 3.19c1.92 1.38 3.29 3 4.12 4.85.82 1.86 1.23 3.88 1.23 6.09 0 2.2-.42 4.23-1.23 6.09-.83 1.86-2.2 3.48-4.12 4.85-1.91 1.4-4.52 2.47-7.82 3.22zm386.13-47.12c-2.94 0-5.31 1.94-5.31 4.76l.03 62.79c0 2.94-1.66 3.61-3.7 1.5l-62.87-65.21c-2.04-2.11-5.03-3.84-9.05-3.84h-11.82c-3.72 0-5.35 1.98-5.35 3.99v100.4c0 2 1.91 3.91 4.85 3.91h11.84c2.93 0 4.99-1.6 4.99-4.3 0-1.36.06-66.15.06-66.15 0-2.94 1.66-3.61 3.69-1.49l65.55 68.15c2.08 2.08 4.61 3.78 9.11 3.78h8.9c2.94 0 5.34-2.4 5.34-5.34V7.655c0-2.94-2.4-5.34-5.34-5.34h-10.92v.03zm-256.33 61.23c-1.43 2.57-3.77 2.56-5.18-.01l-30.73-56.43c-1.31-2.62-3.98-4.77-7.72-4.77h-16.67c-2.94 0-5.34 2.4-5.34 5.34v98.04c0 2.93 1.93 4.94 5.34 4.94h10.36c2.94 0 5.06-1.85 5.06-4.69 0-1.36.04-71.3.15-71.3.11 0 38.36 71.28 38.36 71.28 1.38 2.59 4.78 2.6 6.2.02 0 0 38.56-71.1 38.67-71.1.12 0 .08 69.06.08 71.1 0 2.83 2.27 4.69 5.21 4.69h11.93c2.94 0 5.34-1.46 5.34-5.34V7.705c0-2.94-2.4-5.34-5.34-5.34h-15.98c-4.08 0-6.53 2.08-7.99 4.63l-31.75 56.58zM.385 56.405c0 52.89 54.1 55.57 64.95 55.57 35.9 0 51.07-9.7 51.7-10.12 2.25-1.27 4.98-3.83 4.98-8.63v-36.5c0-3.36-2.74-6.1-6.1-6.1h-45.1c-3.37 0-5.58 2.74-5.58 6.1v3.78c0 3.37 2.21 6.12 5.58 6.12h26.09c2.52 0 4.56 2.05 4.56 4.56 0 0-.03 16-.03 17.02-5.15 2.11-28.63 8.96-47.49 4.46-27.36-6.54-29.49-29.12-29.49-35.88 0-5.67 1.7-34.1 35.3-36.98 27.2-2.33 45.11 8.65 45.29 8.76 3.2 1.66 6.51.48 8.29-2.91.01-.03 3.39-6.88 3.39-6.88 1.41-2.82.94-5.74-2.51-8.07-.23-.13-19.3-10.47-48.88-10.47C2.205.245.385 50.665.385 56.405zm772.87 31.72c6.81 0 12.35 5.54 12.35 12.35s-5.54 12.35-12.35 12.35-12.36-5.54-12.36-12.35c0-6.8 5.55-12.35 12.36-12.35zm.03 22.86c5.68 0 9.96-4.58 9.96-10.5s-4.28-10.51-9.96-10.51c-5.75 0-10.03 4.59-10.03 10.51s4.28 10.5 10.03 10.5zm-4.75-17.76h5.54c3.32 0 4.96 1.34 4.96 4.07 0 2.33-1.47 4.01-3.73 4.01l4.11 6.4h-2.5l-4.04-6.4h-1.98v6.4h-2.36v-14.48zm2.36 6.23h2.81c1.81 0 2.98-.37 2.98-2.26 0-1.65-1.47-2.12-2.98-2.12h-2.81v4.38z"
        fill={color}
      ></path>
    </svg>
  );
})``;

Logo.defaultProps = {
  variant: "primary",
};

Logo.propTypes = {
  variant: PropTypes.oneOf(["light", "primary"]),
};
