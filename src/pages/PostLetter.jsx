import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLetter, getAllDegrees, getAllDepartments } from '../api/axiosApi'
import Select from 'react-select'
import toast from 'react-hot-toast'
import '../styles/tailwind.css'
import { DeleteXIcon } from '../assets/HeroIcons'

const PostLetter = ({ postOpen, onPostClose }) => {
  const queryClient = useQueryClient()
  const { auth } = useAuth()
  const { jwtToken } = auth || null

  const [letterNo, setLetterNo] = useState('')
  const [fromDepartment, setFromDepartment] = useState(null)
  const [toDepartment, setToDepartment] = useState(null)
  const [degree, setDegree] = useState(null)
  const [envelope, setEnvelope] = useState({ value: '1', label: 1 })
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const createLetterMutation = useMutation({
    mutationFn: (letterData) => createLetter(letterData, jwtToken),
    onSuccess: () => {
      toast.success('Məktub uğurla əlavə olundu', { duration: 1000 })
      queryClient.invalidateQueries('lettersData')
    },
    onError: (error) => {
      if (!error?.response) toast.error('Server cavab vermir')
      else if (error?.response?.status === 400) toast.error('Məlumatlar düzgün doldurulmayıb')
      else if (error?.response?.status === 401)
        toast.error('Bu əməliyyatı yerinə yetirməyə səlahiyyətiniz çatmır')
      else if (error?.response?.status === 409) toast.error('Bu nömrəli məktub bazada mövcuddur')
      else toast.error('Error, səhifəni yeniləyin')
    },
  })

  const { data: departments } = useQuery({
    queryKey: ['departments', jwtToken],
    queryFn: () => getAllDepartments(jwtToken),
  })

  const { data: degrees } = useQuery({
    queryKey: ['degrees', jwtToken],
    queryFn: () => getAllDegrees(jwtToken),
  })

  const resetForm = () => {
    setLetterNo('')
    setDate('')
    setNote('')
    setEnvelope({ value: '1', label: 1 })
    setFromDepartment(null)
    setToDepartment(null)
    setDegree(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const letterData = {
      letterNo,
      fromDepartment: {
        id: Number(fromDepartment.value),
      },
      toDepartment: {
        id: Number(toDepartment.value),
      },
      importanceDegree: {
        id: Number(degree.value),
      },
      envelope: Number(envelope),
      date,
      note,
    }
    createLetterMutation.mutate(letterData)
    resetForm()
    // onPostClose()
  }

  const customSelectStyles = {
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      color: 'black',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: 'rgb(0, 238, 255)',
      borderWidth: '2px',
      borderRadius: '30px',
      transition: 'border-color 0.2s ease',
      '&:hover': {
        borderColor: 'rgb(0, 238, 255)',
      },
    }),
  }
  // bg-gradient-to-r from-gray-300 to-gray-100
  return (
    <>
      <div
        onClick={onPostClose}
        className={`
    fixed inset-0 flex items-center justify-center transition-colors
    ${postOpen ? 'visible bg-black/90' : 'invisible'} z-10 cursor-default
    `}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
      rounded-xl shadow ${
        postOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      } custom-box-shadow mb-4 ml-6 mt-4 h-auto w-[70%] rounded-2xl border-2 border-oceanblue bg-darkblue-900 px-6 py-4 shadow-lg transition-all duration-300
      `}
        >
          <div className="-mt-1 text-center text-2xl font-bold text-white">Məktubu yarat</div>
          <button
            onClick={onPostClose}
            className="absolute right-1 top-1 rounded-lg px-2 py-1 text-gray-400 transition-all duration-300 hover:bg-red-600 hover:text-white"
          >
            <DeleteXIcon />
          </button>
          <form onSubmit={handleSubmit} className="flex w-auto flex-col items-center gap-2">
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <label className="w-[32%]">
                <span className="font-bold text-white">Məktub &#8470;:</span>
                <input
                  className="input-style"
                  type="number"
                  value={letterNo}
                  onChange={(e) => {
                    const enteredValue = e.target.value
                    const onlyNumbers = enteredValue.replace(/[^0-9]/g, '') //
                    setLetterNo(onlyNumbers)
                  }}
                  required
                />
              </label>
              <label className="w-[32%]">
                <span className="font-bold text-white">Haradan:</span>
                <Select
                  value={fromDepartment}
                  onChange={setFromDepartment}
                  options={departments?.map((department) => ({
                    value: department.id,
                    label: department.name,
                  }))}
                  required
                  placeholder="Haradan"
                  noOptionsMessage={() => 'Yanlış seçim'}
                  styles={customSelectStyles}
                />
              </label>
              <label className="w-[32%]">
                <span className="font-bold text-white">Hara:</span>
                <Select
                  value={toDepartment}
                  onChange={setToDepartment}
                  options={departments?.map((department) => ({
                    value: department.id,
                    label: department.name,
                  }))}
                  required
                  placeholder="Hara"
                  noOptionsMessage={() => 'Yanlış seçim'}
                  styles={customSelectStyles}
                />
              </label>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <label className="w-[32%]">
                <span className="font-bold text-white">Mühümlük dərəcəsi:</span>
                <Select
                  value={degree}
                  onChange={setDegree}
                  options={degrees?.map((degree) => ({ value: degree.id, label: degree.name }))}
                  required
                  placeholder="Mühümlük"
                  noOptionsMessage={() => 'Yanlış seçim'}
                  styles={customSelectStyles}
                />
              </label>

              <label className="w-[32%]">
                <span className="font-bold text-white">Paket:</span>
                <Select
                  value={envelope}
                  onChange={setEnvelope}
                  options={[
                    { value: '1', label: 1 },
                    { value: '2', label: 2 },
                    { value: '3', label: 3 },
                  ]}
                  required
                  placeholder="Paket"
                  noOptionsMessage={() => 'Yanlış seçim'}
                  styles={customSelectStyles}
                />
              </label>
              <label className="w-[32%]">
                <span className="font-bold text-white">Tarix:</span>
                <input
                  className="input-style"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </label>
            </div>
            <label className="w-full">
              <span className="font-bold text-white">Qeydlər:</span>
              <textarea
                className="input-style h-full resize-none px-3 py-1 text-black"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
              />
            </label>

            <button
              className="custom-box-shadow w-24 rounded-lg border-2 border-oceanblue bg-red-900 py-2 text-lg text-white hover:bg-red-950"
              type="submit"
            >
              Təsdiqlə
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default PostLetter
