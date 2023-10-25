import React from 'react'
import styled from 'styled-components'
const Wrap = styled.span`
  display: inline-block;
  width: ${({ size }) => (size ? size : '28px')};
  height: ${({ size }) => (size ? size : '28px')};
  cursor: pointer;
  user-select: none;
  svg {
    width: 100%;
  }
  line {
    stroke: ${({ checked }) => (checked ? '#fff' : '#333')};
  }
  path {
    fill: ${({ checked }) => (checked ? '#fff' : '#333')};
  }
  background-color: ${({ checked }) => (checked ? '#000' : 'var(--bg-color)')};
`

export function UploadIcon({ checked, onClick }) {
  return (
    <Wrap checked={checked} onClick={onClick}>
      <svg x="0px" y="0px" viewBox="0 0 294.156 294.156">
        <g>
          <path
            d="M227.002,108.256c-2.755-41.751-37.6-74.878-80.036-74.878c-42.447,0-77.298,33.141-80.038,74.907
          C28.978,113.059,0,145.39,0,184.184c0,42.234,34.36,76.595,76.595,76.595h116.483c3.313,0,6-2.687,6-6s-2.687-6-6-6H76.595
          C40.977,248.778,12,219.801,12,184.184c0-34.275,26.833-62.568,61.087-64.411c3.184-0.171,5.678-2.803,5.678-5.991
          c0-0.119-0.003-0.236-0.01-0.355c0.09-37.536,30.654-68.049,68.211-68.049c37.563,0,68.132,30.518,68.211,68.063
          c-0.005,0.116-0.009,0.238-0.009,0.329c0,3.196,2.505,5.831,5.696,5.992c34.37,1.741,61.292,30.038,61.292,64.421
          c0,19.526-8.698,37.801-23.864,50.138c-2.571,2.091-2.959,5.87-0.868,8.44c2.091,2.571,5.87,2.959,8.44,0.868
          c17.98-14.626,28.292-36.293,28.292-59.447C294.156,145.269,265.08,112.926,227.002,108.256z"
          />
          <path d="M140.966,141.078v76.511c0,3.313,2.687,6,6,6s6-2.687,6-6v-76.511c0-3.313-2.687-6-6-6S140.966,137.765,140.966,141.078z" />
          <path
            d="M181.283,152.204c1.536,0,3.071-0.586,4.243-1.757c2.343-2.343,2.343-6.142,0-8.485l-34.317-34.317
          c-2.343-2.343-6.143-2.343-8.485,0l-34.317,34.317c-2.343,2.343-2.343,6.142,0,8.485c2.343,2.343,6.143,2.343,8.485,0
          l30.074-30.074l30.074,30.074C178.212,151.618,179.748,152.204,181.283,152.204z"
          />
        </g>
      </svg>
    </Wrap>
  )
}

export function ImgIcon({ checked, onClick }) {
  return (
    <Wrap checked={checked} onClick={onClick}>
      <svg x="0px" y="0px" viewBox="0 0 60 60">
        <g>
          <path
            d="M56,43.832c-0.43-4.107-3.853-7.332-7.954-7.332c-2.565,0-4.984,1.286-6.479,3.402c-0.292-0.051-0.588-0.076-0.884-0.076
		c-2.32,0-4.381,1.577-5.066,3.813C33.709,44.77,32.5,46.88,32.5,49.142c0,3.506,2.785,6.358,6.208,6.358h10.774
		c0.063,0,0.124-0.004,0.172-0.008c0.062,0.004,0.124,0.008,0.188,0.008h4.31c3.225,0,5.849-2.687,5.849-5.989
		C60,46.911,58.358,44.638,56,43.832z M54.151,53.5L49.8,53.497l-0.186-0.006L38.708,53.5c-2.32,0-4.208-1.955-4.208-4.358
		c0-1.666,0.948-3.21,2.417-3.935l0.435-0.214l0.102-0.475c0.331-1.56,1.689-2.692,3.229-2.692c0.344,0,0.687,0.057,1.019,0.169
		l0.777,0.261l0.409-0.711c1.096-1.906,3.023-3.045,5.158-3.045c3.265,0,5.955,2.747,5.999,6.123l0.011,0.813l0.799,0.155
		C56.677,45.946,58,47.594,58,49.511C58,51.71,56.273,53.5,54.151,53.5z"
          />
          <path
            d="M21.569,18.069c0-3.071-2.498-5.569-5.569-5.569s-5.569,2.498-5.569,5.569c0,3.07,2.498,5.568,5.569,5.568
		S21.569,21.14,21.569,18.069z M12.431,18.069c0-1.968,1.602-3.569,3.569-3.569s3.569,1.602,3.569,3.569S17.968,21.638,16,21.638
		S12.431,20.037,12.431,18.069z"
          />
          <path
            d="M51.324,31.237c0.408,0.373,1.039,0.345,1.413-0.062c0.373-0.407,0.346-1.04-0.062-1.413l-12-11
		c-0.195-0.18-0.46-0.275-0.72-0.262c-0.266,0.012-0.516,0.129-0.694,0.325l-9.794,10.727l-4.743-4.743
		c-0.371-0.372-0.972-0.391-1.368-0.044L6.339,39.749c-0.414,0.365-0.454,0.997-0.09,1.412C6.447,41.386,6.723,41.5,7,41.5
		c0.235,0,0.471-0.082,0.661-0.249l16.313-14.362l10.302,10.301c0.391,0.391,1.023,0.391,1.414,0s0.391-1.023,0-1.414l-4.807-4.807
		l9.18-10.054L51.324,31.237z"
          />
          <path
            d="M27,48.5H2v-42h54v29c0,0.553,0.447,1,1,1s1-0.447,1-1v-30c0-0.553-0.447-1-1-1H1c-0.553,0-1,0.447-1,1v44
		c0,0.553,0.447,1,1,1h26c0.553,0,1-0.447,1-1S27.553,48.5,27,48.5z"
          />
        </g>
      </svg>
    </Wrap>
  )
}

export function CloseIcon({ checked = false, onClick, size }) {
  return (
    <Wrap checked={checked} onClick={onClick} size={size}>
      <svg fill="#000000" viewBox="0 0 50 50">
        <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
      </svg>
    </Wrap>
  )
}

export function ListIcon({ checked, onClick }) {
  return (
    <Wrap checked={checked} onClick={onClick}>
      <svg x="0px" y="0px" viewBox="0 0 64 64">
        <g>
          <path
            d="M22.9840508,12.7494497h40c0.5522995,0,0.9995995-0.4471998,0.9995995-0.9994993
		c0-0.5522003-0.4473-0.9995003-0.9995995-0.9995003h-40c-0.5522003,0-0.9995003,0.4473-0.9995003,0.9995003
		C21.9845505,12.3022499,22.4318504,12.7494497,22.9840508,12.7494497z"
          />
          <path
            d="M62.9840508,31.2963505h-40c-0.5522003,0-0.9995003,0.4473-0.9995003,0.9994984
		c0,0.5522995,0.4473,0.9995003,0.9995003,0.9995003h40c0.5522995,0,0.9995995-0.4472008,0.9995995-0.9995003
		C63.9836502,31.7436504,63.5363503,31.2963505,62.9840508,31.2963505z"
          />
          <path
            d="M62.9840508,51.2504501h-40c-0.5522003,0-0.9995003,0.4473-0.9995003,0.9995003
		c0,0.5522995,0.4473,0.9995003,0.9995003,0.9995003h40c0.5522995,0,0.9995995-0.4472008,0.9995995-0.9995003
		C63.9836502,51.6977501,63.5363503,51.2504501,62.9840508,51.2504501z"
          />
          <path
            d="M5.9840508,5.7822499c-3.2904999,0-5.9677,2.6771998-5.9677,5.9677005c0,3.2905998,2.6772001,5.9678001,5.9677,5.9678001
		c3.2905998,0,5.9678001-2.6772003,5.9678001-5.9678001C11.9518509,8.4594498,9.2746506,5.7822499,5.9840508,5.7822499z
		 M5.9840508,15.7822504c-2.2235854,0-4.0321999-1.8086004-4.0321999-4.0323c0-2.2236004,1.8086146-4.0322003,4.0321999-4.0322003
		c2.2236996,0,4.0323,1.8085999,4.0323,4.0322003C10.0163507,13.97365,8.2077503,15.7822504,5.9840508,15.7822504z"
          />
          <path
            d="M5.9840508,26.3281498c-3.2904999,0-5.9677,2.6772003-5.9677,5.9676991c0,3.2905998,2.6772001,5.9678001,5.9677,5.9678001
		c3.2905998,0,5.9678001-2.6772003,5.9678001-5.9678001C11.9518509,29.0053501,9.2746506,26.3281498,5.9840508,26.3281498z
		 M5.9840508,36.3281517c-2.2235854,0-4.0321999-1.8086014-4.0321999-4.0323029c0-2.2235985,1.8086146-4.032198,4.0321999-4.032198
		c2.2236996,0,4.0323,1.8085995,4.0323,4.032198C10.0163507,34.5195503,8.2077503,36.3281517,5.9840508,36.3281517z"
          />
          <path
            d="M5.9840508,46.2822495c-3.2904999,0-5.9677,2.6772003-5.9677,5.967701c0,3.2905998,2.6772001,5.9678001,5.9677,5.9678001
		c3.2905998,0,5.9678001-2.6772003,5.9678001-5.9678001C11.9518509,48.9594498,9.2746506,46.2822495,5.9840508,46.2822495z
		 M5.9840508,56.2822495c-2.2235854,0-4.0321999-1.8085976-4.0321999-4.032299c0-2.2236023,1.8086146-4.0321999,4.0321999-4.0321999
		c2.2236996,0,4.0323,1.8085976,4.0323,4.0321999C10.0163507,54.4736519,8.2077503,56.2822495,5.9840508,56.2822495z"
          />
        </g>
      </svg>
    </Wrap>
  )
}

export function AudioIcon({ checked, onClick }) {
  return (
    <Wrap checked={checked} onClick={onClick}>
      <svg viewBox="0 0 96 96" version="1.1">
        <g>
          <path d="M39.3,25.5c-0.5,0.1-0.8,0.5-0.8,1v35.7c-0.6-0.5-1.2-0.8-2-1.1c-2.8-1-6.7-0.6-10.2,1c-5.9,2.8-9.1,7.9-7.3,11.8   c0.6,1.4,1.8,2.4,3.5,3c1.1,0.4,2.2,0.6,3.5,0.6c2.1,0,4.5-0.5,6.7-1.6c5.1-2.4,8.2-6.6,7.8-10.2c0-0.1,0-0.1,0-0.2V27.3l35-7.6   v37.5c-0.6-0.5-1.2-0.8-2-1.1c-2.8-1-6.7-0.7-10.2,1c-5.9,2.8-9.1,7.9-7.3,11.8c0.6,1.4,1.8,2.4,3.5,3c1.1,0.4,2.2,0.6,3.5,0.6   c2.1,0,4.5-0.5,6.7-1.6c5.1-2.4,8.2-6.6,7.8-10.2c0-0.1,0-0.1,0-0.2V18.5" />
        </g>
      </svg>
    </Wrap>
  )
}

export function PlayIcon({ checked, onClick }) {
  return (
    <Wrap checked={checked} onClick={onClick}>
      <svg viewBox="0 0 64 64" strokeWidth="3" stroke="#000000" fill="none">
        <path d="M24.35,42.59V21.41A.49.49,0,0,1,25.1,21L41.77,31.59a.49.49,0,0,1,0,.82L25.1,43A.49.49,0,0,1,24.35,42.59Z" />
        <circle cx="32" cy="32" r="25.48" />
      </svg>
    </Wrap>
  )
}

export function PauseIcon({ checked, onClick }) {
  return (
    <Wrap checked={checked} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          clipRule="evenodd"
          d="m3.75 12c0-4.55635 3.69365-8.25 8.25-8.25 4.5563 0 8.25 3.69365 8.25 8.25 0 4.5563-3.6937 8.25-8.25 8.25-4.55635 0-8.25-3.6937-8.25-8.25zm8.25-9.75c-5.38478 0-9.75 4.36522-9.75 9.75 0 5.3848 4.36522 9.75 9.75 9.75 5.3848 0 9.75-4.3652 9.75-9.75 0-5.38478-4.3652-9.75-9.75-9.75zm-2 6c.4142 0 .75.33579.75.75v6c0 .4142-.3358.75-.75.75-.41421 0-.75-.3358-.75-.75v-6c0-.41421.33579-.75.75-.75zm4 0c.4142 0 .75.33579.75.75v6c0 .4142-.3358.75-.75.75s-.75-.3358-.75-.75v-6c0-.41421.3358-.75.75-.75z"
          fill="#000000"
          fillRule="evenodd"
        />
      </svg>
    </Wrap>
  )
}

export function ArrowUpIcon({ checked, onClick }) {
  return (
    <Wrap checked={checked} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 7V17M12 7L16 11M12 7L8 11"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Wrap>
  )
}

export function ArrowDownIcon({ checked, onClick }) {
  return (
    <Wrap checked={checked} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 17L12 7M12 17L8 13M12 17L16 13"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Wrap>
  )
}

export function DeleteIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg fill="#000000" viewBox="-1.7 0 20.4 20.4">
        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
      </svg>
    </Wrap>
  )
}

export function InsertIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg fill="#000000" viewBox="0 0 32 32">
        <path d="M26,30H24V20H12V30H10V20a2.0021,2.0021,0,0,1,2-2H24a2.0021,2.0021,0,0,1,2,2Z" />
        <polygon points="5.17 16 2 19.17 3.411 20.589 8 16 3.42 11.42 2 12.83 5.17 16" />
        <path d="M24,14H12a2.0021,2.0021,0,0,1-2-2V2h2V12H24V2h2V12A2.0021,2.0021,0,0,1,24,14Z" />
        <rect fill="none" width="32" height="32" />
      </svg>
    </Wrap>
  )
}

export function AddTagIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={checked ? '#fff' : '#000'}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="miter"
      >
        <polygon points="20 22 12 16 4 22 4 2 20 2 20 22"></polygon>
        <line x1="12" y1="6" x2="12" y2="12"></line>
        <line x1="15" y1="9" x2="9" y2="9"></line>
      </svg>
    </Wrap>
  )
}

export function PlayVideoIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M16.2111 11.1056L9.73666 7.86833C8.93878 7.46939 8 8.04958 8 8.94164V15.0584C8 15.9504 8.93878 16.5306 9.73666 16.1317L16.2111 12.8944C16.9482 12.5259 16.9482 11.4741 16.2111 11.1056Z"
          stroke="#222222"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="9" stroke="#222222" />
      </svg>
    </Wrap>
  )
}

export function ToggleIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg
        fill="#000000"
        viewBox="0 0 120 120"
        enableBackground="new 0 0 120 120"
      >
        <g>
          <path
            d="M60,16.005c0,0,0.001,19.736,0.001,43.994c0,24.258-0.001,43.995-0.001,43.995c-24.258,0-43.994-19.736-43.994-43.995
		C16.006,35.742,35.742,16.005,60,16.005 M60,5.005C29.627,5.005,5.006,29.626,5.006,60c0,30.372,24.622,54.995,54.994,54.995
		S114.995,90.371,114.995,60C114.995,29.626,90.372,5.005,60,5.005L60,5.005z"
          />
        </g>
      </svg>
    </Wrap>
  )
}

export function InsertBeforeIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        enableBackground="new 0 0 64 64"
      >
        <line
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="22"
          y1="29"
          x2="64"
          y2="29"
        />
        <line
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="22"
          y1="39"
          x2="56"
          y2="39"
        />
        <line
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="22"
          y1="49"
          x2="64"
          y2="49"
        />
        <line
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="22"
          y1="59"
          x2="58"
          y2="59"
        />
        <g>
          <g>
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              points="59,11 59,9 57,9 		"
            />

            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="4,2"
              x1="55"
              y1="9"
              x2="26"
              y2="9"
            />
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              points="25,9 23,9 23,11 		"
            />

            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="3,2"
              x1="23"
              y1="13"
              x2="23"
              y2="16"
            />
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              points="23,17 23,19 25,19 		"
            />

            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="4,2"
              x1="27"
              y1="19"
              x2="56"
              y2="19"
            />
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              points="57,19 59,19 59,17 		"
            />

            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="3,2"
              x1="59"
              y1="16"
              x2="59"
              y2="12"
            />
          </g>
        </g>
        <g>
          <polyline
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="bevel"
            strokeMiterlimit="10"
            points="10,21 17,14 
   10,7 	"
          />
          <g>
            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              x1="17"
              y1="14"
              x2="0"
              y2="14"
            />
          </g>
        </g>
      </svg>
    </Wrap>
  )
}

export function InsertAfterIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        enableBackground="new 0 0 64 64"
      >
        <line
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="22"
          y1="6"
          x2="64"
          y2="6"
        />
        <line
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="22"
          y1="16"
          x2="56"
          y2="16"
        />
        <line
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="22"
          y1="26"
          x2="64"
          y2="26"
        />
        <line
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="22"
          y1="36"
          x2="58"
          y2="36"
        />
        <g>
          <g>
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              points="59,48 59,46 57,46 		"
            />

            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="4,2"
              x1="55"
              y1="46"
              x2="26"
              y2="46"
            />
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              points="25,46 23,46 23,48 		"
            />

            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="3,2"
              x1="23"
              y1="50"
              x2="23"
              y2="53"
            />
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              points="23,54 23,56 25,56 		"
            />

            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="4,2"
              x1="27"
              y1="56"
              x2="56"
              y2="56"
            />
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              points="57,56 59,56 59,54 		"
            />

            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="3,2"
              x1="59"
              y1="53"
              x2="59"
              y2="49"
            />
          </g>
        </g>
        <g>
          <polyline
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="bevel"
            strokeMiterlimit="10"
            points="10,58 17,51 
   10,44 	"
          />
          <g>
            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              x1="17"
              y1="51"
              x2="0"
              y2="51"
            />
          </g>
        </g>
      </svg>
    </Wrap>
  )
}

export function EditIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.56078 20.2501L20.5608 8.25011L15.7501 3.43945L3.75012 15.4395V20.2501H8.56078ZM15.7501 5.56077L18.4395 8.25011L16.5001 10.1895L13.8108 7.50013L15.7501 5.56077ZM12.7501 8.56079L15.4395 11.2501L7.93946 18.7501H5.25012L5.25012 16.0608L12.7501 8.56079Z"
          fill="#080341"
        />
      </svg>
    </Wrap>
  )
}

export function RefreshIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" />
        <path
          d="M2.5 12C2.5 12.2761 2.72386 12.5 3 12.5C3.27614 12.5 3.5 12.2761 3.5 12H2.5ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5V2.5C6.75329 2.5 2.5 6.75329 2.5 12H3.5ZM12 3.5C15.3367 3.5 18.2252 5.4225 19.6167 8.22252L20.5122 7.77748C18.9583 4.65062 15.7308 2.5 12 2.5V3.5Z"
          fill="#000000"
        />
        <path
          d="M20.4716 2.42157V8.07843H14.8147"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.5 12C21.5 11.7239 21.2761 11.5 21 11.5C20.7239 11.5 20.5 11.7239 20.5 12L21.5 12ZM20.5 12C20.5 16.6944 16.6944 20.5 12 20.5L12 21.5C17.2467 21.5 21.5 17.2467 21.5 12L20.5 12ZM12 20.5C8.66333 20.5 5.77477 18.5775 4.38328 15.7775L3.48776 16.2225C5.04168 19.3494 8.26923 21.5 12 21.5L12 20.5Z"
          fill="#000000"
        />
        <path
          d="M3.52844 21.5784L3.52844 15.9216L9.18529 15.9216"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Wrap>
  )
}

export function TextIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg
        fill="#000000"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5.15109186,12 L9.84890814,12 L7.5,5.89283883 L5.15109186,12 L5.15109186,12 Z M4.76647647,13 L2.9666728,17.6794895 C2.86754347,17.9372258 2.57824673,18.0658021 2.32051046,17.9666728 C2.06277419,17.8675435 1.93419786,17.5782467 2.0333272,17.3205105 L7.0333272,4.32051046 C7.19769154,3.89316318 7.80230846,3.89316318 7.9666728,4.32051046 L12.9666728,17.3205105 C13.0658021,17.5782467 12.9372258,17.8675435 12.6794895,17.9666728 C12.4217533,18.0658021 12.1324565,17.9372258 12.0333272,17.6794895 L10.2335235,13 L4.76647647,13 Z M20.9570562,10.7969621 C20.9846595,10.8590065 21,10.9277118 21,11 C21,11.0680009 20.9975396,11.1347877 20.9926422,11.2003536 C20.9975423,11.2981122 21,11.3979995 21,11.5 L21,16.5 C21,16.7761424 21.2238576,17 21.5,17 C21.7761424,17 22,17.2238576 22,17.5 C22,17.7761424 21.7761424,18 21.5,18 C20.9667087,18 20.4984178,17.7216998 20.232437,17.3024088 C19.7830891,17.7344189 19.1725594,18 18.5,18 L16.5,18 C14.578646,18 13.5,17.1370832 13.5,15.5 C13.5,13.8048215 14.4884102,13.2846056 17.1695763,12.7689968 C17.273648,12.7489936 17.273648,12.7489936 17.377313,12.7289978 C17.8222599,12.6429747 18.1021245,12.5840807 18.3787322,12.5149287 C19.4171745,12.2553182 19.9157867,11.8201648 19.990146,11.1762976 C19.8952664,9.6786695 19.1119808,9 17.5,9 C15.7435171,9 15,9.49567806 15,10.5 C15,10.7761424 14.7761424,11 14.5,11 C14.2238576,11 14,10.7761424 14,10.5 C14,8.83765527 15.2564829,8 17.5,8 C19.529353,8 20.7222375,8.97285307 20.9570562,10.7969621 L20.9570562,10.7969621 Z M20,15.5 L20,12.8965747 C19.6342901,13.1504595 19.1724164,13.3472841 18.6212678,13.4850713 C18.3228164,13.5596841 18.0285165,13.6216159 17.5671314,13.710817 C17.4624631,13.7310064 17.4624631,13.7310064 17.3584237,13.7510032 C15.1484383,14.1760004 14.5,14.5172837 14.5,15.5 C14.5,16.5295834 15.0880207,17 16.5,17 L18.5,17 C19.3284271,17 20,16.3284271 20,15.5 Z" />
      </svg>
    </Wrap>
  )
}

export function VdotsIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.5 4C14.5 5.38071 13.3807 6.5 12 6.5C10.6193 6.5 9.5 5.38071 9.5 4C9.5 2.61929 10.6193 1.5 12 1.5C13.3807 1.5 14.5 2.61929 14.5 4Z"
          fill="#000000"
        />
        <path
          d="M14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12Z"
          fill="#000000"
        />
        <path
          d="M12 22.5C13.3807 22.5 14.5 21.3807 14.5 20C14.5 18.6193 13.3807 17.5 12 17.5C10.6193 17.5 9.5 18.6193 9.5 20C9.5 21.3807 10.6193 22.5 12 22.5Z"
          fill="#000000"
        />
      </svg>
    </Wrap>
  )
}

export function ReverseIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#000000"
          d="M384 96a32 32 0 0 1 64 0v786.752a32 32 0 0 1-54.592 22.656L95.936 608a32 32 0 0 1 0-45.312h.128a32 32 0 0 1 45.184 0L384 805.632V96zm192 45.248a32 32 0 0 1 54.592-22.592L928.064 416a32 32 0 0 1 0 45.312h-.128a32 32 0 0 1-45.184 0L640 218.496V928a32 32 0 1 1-64 0V141.248z"
        />
      </svg>
    </Wrap>
  )
}

export function AddIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg
        fill="#000000"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 492.308 492.308"
      >
        <g>
          <g>
            <path d="M0,0v492.308h492.308V0H0z M472.615,472.615H19.692V19.692h452.923V472.615z" />
          </g>
        </g>
        <g>
          <g>
            <polygon
              points="256,236.308 256,114.019 236.308,114.019 236.308,236.308 114.024,236.308 114.024,256 236.308,256 
			236.308,378.288 256,378.288 256,256 378.288,256 378.288,236.308 		"
            />
          </g>
        </g>
      </svg>
    </Wrap>
  )
}

export function SaveIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.765 2c1.187 0 1.363.06 1.51.168L21.662 4.7a.845.845 0 0 1 .339.677v15.78a.844.844 0 0 1-.844.844H2.844A.844.844 0 0 1 2 21.156V2.844A.844.844 0 0 1 2.844 2zM17 21v-7H7v7zM14 3v3h1V3zM7 3v6h10V3h-1v4h-3V3zM3 21h3v-8h12v8h3V5.452l-3-2.278v6.17a.769.769 0 0 1-.844.656H6.844A.769.769 0 0 1 6 9.344V3H3z" />
      </svg>
    </Wrap>
  )
}

export function MenuIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="3"
        fill="none"
      >
        <line x1="7.68" y1="32" x2="56.32" y2="32" />
        <line x1="7.68" y1="15.97" x2="56.32" y2="15.97" />
        <line x1="7.68" y1="48.03" x2="56.32" y2="48.03" />
      </svg>
    </Wrap>
  )
}

export function WriteIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48"
          style={{
            fill: 'none',
            stroke: checked ? '#fff' : '#333',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '32px',
          }}
        />
        <path d="M459.94,53.25a16.06,16.06,0,0,0-23.22-.56L424.35,65a8,8,0,0,0,0,11.31l11.34,11.32a8,8,0,0,0,11.34,0l12.06-12C465.19,69.54,465.76,59.62,459.94,53.25Z" />
        <path d="M399.34,90,218.82,270.2a9,9,0,0,0-2.31,3.93L208.16,299a3.91,3.91,0,0,0,4.86,4.86l24.85-8.35a9,9,0,0,0,3.93-2.31L422,112.66A9,9,0,0,0,422,100L412.05,90A9,9,0,0,0,399.34,90Z" />
      </svg>
    </Wrap>
  )
}

export function QuoteIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg
        fill="#000000"
        viewBox="0 0 56 56"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 16.5860 52.2461 C 17.7579 52.2461 18.5548 51.6367 19.9610 50.3711 L 28.0704 43.1758 L 43.0938 43.1758 C 50.0783 43.1758 53.8280 39.3086 53.8280 32.4414 L 53.8280 14.4883 C 53.8280 7.6211 50.0783 3.7539 43.0938 3.7539 L 12.9064 3.7539 C 5.9454 3.7539 2.1720 7.5976 2.1720 14.4883 L 2.1720 32.4414 C 2.1720 39.3320 5.9454 43.1758 12.9064 43.1758 L 14.0313 43.1758 L 14.0313 49.2695 C 14.0313 51.0742 14.9688 52.2461 16.5860 52.2461 Z M 17.5469 47.9570 L 17.5469 41.1602 C 17.5469 39.8945 17.0782 39.4023 15.7891 39.4023 L 12.9298 39.4023 C 8.1720 39.4023 5.9454 36.9883 5.9454 32.4180 L 5.9454 14.4883 C 5.9454 9.9180 8.1720 7.5273 12.9298 7.5273 L 43.0938 7.5273 C 47.8280 7.5273 50.0548 9.9180 50.0548 14.4883 L 50.0548 32.4180 C 50.0548 36.9883 47.8280 39.4023 43.0938 39.4023 L 27.9064 39.4023 C 26.6173 39.4023 25.9376 39.5898 25.0469 40.5039 Z M 17.2423 22.3633 C 17.2423 24.9414 18.8360 26.9336 21.4142 26.9336 C 22.3516 26.9336 23.2891 26.7695 23.8751 26.0430 L 24.0626 26.0430 C 23.2188 27.8945 21.5079 29.0898 20.0313 29.4649 C 19.1876 29.6992 18.9298 30.0742 18.9298 30.6133 C 18.9298 31.1992 19.3985 31.6445 20.0548 31.6445 C 22.3516 31.6445 26.9220 28.9258 26.9220 23.2071 C 26.9220 20.1367 24.9298 17.7695 22.0001 17.7695 C 19.2813 17.7695 17.2423 19.6680 17.2423 22.3633 Z M 29.4298 22.3633 C 29.4298 24.9414 31.0235 26.9336 33.6016 26.9336 C 34.5391 26.9336 35.4766 26.7695 36.0626 26.0430 L 36.2501 26.0430 C 35.4064 27.8945 33.6954 29.0898 32.2188 29.4649 C 31.3751 29.6992 31.1173 30.0742 31.1173 30.6133 C 31.1173 31.1992 31.5860 31.6445 32.2423 31.6445 C 34.5391 31.6445 39.1329 28.9258 39.1329 23.2071 C 39.1329 20.1367 37.1173 17.7695 34.1876 17.7695 C 31.4688 17.7695 29.4298 19.6680 29.4298 22.3633 Z" />
      </svg>
    </Wrap>
  )
}

export function ThemeIcon({ size, checked, onClick }) {
  return (
    <Wrap checked={checked} size={size} onClick={onClick}>
      <svg
        fill="#000000"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512.001 512.001"
      >
        <g>
          <g>
            <path
              d="M256.001,0C151.75,0,66.937,84.814,66.937,189.064c0,78.063,47.557,145.223,115.219,174.041v70.101
     c0,21.088,15.819,38.538,36.211,41.138v2.218c0,19.541,15.897,35.438,35.438,35.438s35.438-15.898,35.438-35.438v-2.218
     c20.392-2.601,36.211-20.051,36.211-41.138V364.91c69.986-27.74,119.609-96.106,119.609-175.846
     C445.064,84.814,360.251,0,256.001,0z M253.806,491.602c-8.293,0-15.04-6.747-15.04-15.04v-1.872h30.079v1.872h0.001
     C268.845,484.855,262.099,491.602,253.806,491.602z M305.057,433.206c0,11.627-9.46,21.087-21.087,21.087h-60.328v-0.001
     c-8.995,0-16.671-5.672-19.696-13.619h43.276c5.633,0,10.199-4.566,10.199-10.199c0-5.633-4.566-10.199-10.199-10.199h-44.667
     v-15.813h44.667c5.633,0,10.199-4.566,10.199-10.199c0-5.633-4.566-10.199-10.199-10.199h-44.667v-13.642
     c16.955,5.006,34.89,7.706,53.446,7.706c16.962,0,33.404-2.258,49.056-6.467V433.206z M256.001,357.728
     c-6.581,0-13.071-0.392-19.458-1.129c0.07-0.97,0.007-1.964-0.216-2.962l-33.443-149.985h16.904c2.705,0,5.299-1.075,7.212-2.987
     l10.894-10.894l32.841,32.84c3.983,3.983,10.441,3.983,14.424,0l18.958-18.959h4.999l-19.252,86.34
     c-1.226,5.498,2.237,10.949,7.735,12.175c5.499,1.226,10.948-2.237,12.175-7.735l22.021-98.759
     c0.674-3.02-0.061-6.184-1.997-8.599c-1.936-2.415-4.863-3.821-7.958-3.821h-21.947c-2.705,0-5.299,1.075-7.212,2.987
     l-14.734,14.735l-32.841-32.84c-1.912-1.912-4.507-2.987-7.212-2.987c-2.705,0-5.299,1.075-7.212,2.987l-15.118,15.118H190.16
     c-3.095,0-6.023,1.405-7.958,3.821c-1.936,2.415-2.67,5.578-1.997,8.599l35.02,157.062
     C141.858,334.451,87.333,268.01,87.333,189.064c0.002-93.002,75.665-168.665,168.667-168.665s168.665,75.663,168.665,168.665
     S349.003,357.728,256.001,357.728z"
            />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M295.434,311.886c-5.501-1.23-10.949,2.237-12.175,7.734l-1.468,6.583c-1.226,5.497,2.237,10.949,7.734,12.175
     c0.748,0.167,1.494,0.247,2.23,0.247c4.672,0,8.886-3.231,9.945-7.981l1.468-6.583
     C304.394,318.563,300.931,313.112,295.434,311.886z"
            />
          </g>
        </g>
      </svg>
    </Wrap>
  )
}
