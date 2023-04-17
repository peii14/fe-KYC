import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";

interface BinaryPicker {}

export default function BinaryPicker({
  plans,
  selected,
  setSelected,
}: {
  plans: any;
  selected: any;
  setSelected: any;
}) {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup
          value={
            plans[plans.findIndex((obj) => obj.gender === selected.gender)]
          }
          onChange={setSelected}
        >
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="h-14  flex w-full justify-around">
            {plans.map((plan) => (
              <RadioGroup.Option
                key={plan.gender}
                value={plan}
                className={({ active, checked }) =>
                  `w-32 h-full ${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                      : ""
                  }
                  ${
                    checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
                  }
                    relative flex  cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {plan.gender}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
