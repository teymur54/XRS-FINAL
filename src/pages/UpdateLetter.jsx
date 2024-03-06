import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getAllDegrees, getAllDepartments, updateLetter, getLetterById } from '../api/axiosApi'
import { DeleteXIcon } from '../assets/HeroIcons'
import { useAuth } from '../context/AuthContext'
import Select from 'react-select'

const UpdateLetter = ({ letterId, updateOpen, onUpdateClose, singleLetter }) => {
  const { auth } = useAuth()
  const { jwtToken } = auth || null
  const queryClient = useQueryClient()

  const [letterNo, setLetterNo] = useState('')
  const [fromDepartment, setFromDepartment] = useState(null)
  const [toDepartment, setToDepartment] = useState(null)
  const [degree, setDegree] = useState(null)
  const [envelope, setEnvelope] = useState({ value: '1', label: 1 })
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const { data: letterData } = useQuery({
    queryKey: ['letter', jwtToken, letterId],
    queryFn: () => getLetterById(letterId, jwtToken),
    enabled: !!letterId,
  })

  const { data: departments } = useQuery({
    queryKey: ['departments', jwtToken],
    queryFn: () => getAllDepartments(jwtToken),
  })

  const { data: degrees } = useQuery({
    queryKey: ['degrees', jwtToken],
    queryFn: () => getAllDegrees(jwtToken),
  })

  const departmentsOptions = departments?.map((department) => ({
    value: department.id,
    label: department.name,
  }))

  const degreesOptions = degrees?.map((degree) => ({
    value: degree.id,
    label: degree.name,
  }))

  useLayoutEffect(() => {
    if (letterData?.id) {
      setLetterNo(letterData?.letterNo)
      setFromDepartment(departmentsOptions?.find((option) => option.value === letterData?.fromDepartment?.id))
      setToDepartment(departmentsOptions?.find((option) => option.value === letterData?.toDepartment?.id))
      setDegree(degreesOptions?.find((option) => option.value === letterData?.importanceDegree?.id))
      setDate(letterData?.date)
      setNote(letterData?.note)
    }
  }, [letterData?.id, letterId])

  const updateLetterMutation = useMutation({
    mutationFn: (data) => updateLetter(data.letterId, data.updatedLetterData, jwtToken),
    onSuccess: (data) => {
      setLetterNo('')
      queryClient.invalidateQueries('lettersData')
      queryClient.invalidateQueries('letters')
      toast.success('Məktub uğurla yeniləndi', { duration: 1000 })
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedLetterData = {
      letterNo,
      fromDepartment: { id: Number(fromDepartment.value) },
      toDepartment: { id: Number(toDepartment.value) },
      importanceDegree: { id: Number(degree.value) },
      envelope: Number(envelope),
      date,
      note,
    }
    updateLetterMutation.mutate({ letterId, updatedLetterData })
    onUpdateClose()
  }

  const customSelectStyles = {
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      color: '#4a5568',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      marginTop: '2px',
      borderColor: 'rgb(0, 238, 255)',
      borderWidth: '2px',
      borderRadius: '30px',
      transition: 'border-color 0.2s ease',
      '&:hover': {
        borderColor: 'rgb(0, 238, 255)',
      },
    }),
  }

  return (
    <div
      onClick={onUpdateClose}
      className={`
    fixed inset-0 z-10 flex items-center justify-center transition-colors
    ${updateOpen ? 'visible bg-black/20' : 'invisible'}
    `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
       rounded-xl shadow ${
         updateOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
       } custom-box-shadow mb-4 ml-6 mt-4 h-auto w-[70%] rounded-2xl border-2 border-oceanblue bg-darkblue-900 px-6 py-4 shadow-lg`}
      >
        <div className="-mt-1 text-center text-2xl font-bold text-white">Redaktə əməliyyatı</div>
        <button
          onClick={onUpdateClose}
          className="absolute right-1 top-1 rounded-lg px-2 py-1 text-gray-400 transition-all duration-300 hover:bg-red-600 hover:text-white"
        >
          <DeleteXIcon />
        </button>
        <form className="mt-2 flex w-auto flex-col items-center gap-2" onSubmit={handleSubmit}>
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
                options={departmentsOptions}
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
                options={departmentsOptions}
                required
                placeholder="Hara"
                noOptionsMessage={() => 'Yanlış seçim'}
                styles={customSelectStyles}
              />
            </label>
          </div>

          <div className="mt-3 flex w-full flex-row items-center justify-between gap-2">
            <label className="w-[32%]">
              <span className="font-bold text-white">Mühümlük dərəcəsi:</span>
              <Select
                value={degree}
                onChange={setDegree}
                options={degreesOptions}
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
              className="input-style h-full resize-none bg-white px-3 py-1 text-black"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
            />
          </label>

          <button
            className="custom-box-shadow w-24 rounded-lg border-2 border-oceanblue bg-red-950 py-1 text-lg text-white hover:bg-red-600"
            type="submit"
          >
            Təsdiqlə
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateLetter
