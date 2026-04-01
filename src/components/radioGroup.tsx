import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RadioGroupChoiceCardProps {
  value: string
  onChange: (value: string) => void  // ← reçoit les props de Controller
}

export function RadioGroupChoiceCard({value,onChange}: RadioGroupChoiceCardProps) {
  return (
    <RadioGroup 
    value={value}          // ← valeur contrôlée
    onValueChange={onChange} 
    defaultValue="entrepreneur" className="md:w-50 w-full grid gap-4">
      <FieldLabel  htmlFor="entrepreneur-register">
        <Field  orientation="horizontal">
          <RadioGroupItem value="entrepreneur" id="entrepreneur-register" />
          <FieldContent>
            <FieldTitle>Entrepreneur</FieldTitle>
            {/* <FieldDescription className="hidden md:block">
              créer et innover
            </FieldDescription> */}
          </FieldContent>

        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="mentor-register">
        <Field orientation="horizontal">
          <RadioGroupItem value="mentor" id="mentor-register" />
          <FieldContent>
            <FieldTitle>Mentor</FieldTitle>
            {/* <FieldDescription>
              aider et accompagner les porteurs de projets
            </FieldDescription> */}
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="investisseur-register">
        <Field orientation="horizontal">
          <RadioGroupItem value="investisseur" id="investisseur-register" />
          <FieldContent>
            <FieldTitle>Investisseur</FieldTitle>
          </FieldContent>
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}
