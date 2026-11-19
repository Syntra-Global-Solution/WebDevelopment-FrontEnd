import test from 'node:test'
import assert from 'node:assert/strict'
import { transportLines } from '../src/data/transportData.js'
import { getTrainPredictions, searchTransport } from '../src/services/transportService.js'

test('searchTransport localiza uma linha pelo nome da estação', async () => {
  const results = await searchTransport({ type: 'train', query: 'Pinheiros', direction: '' })
  assert.deepEqual(results.map((line) => line.id), ['train-9'])
})

test('getTrainPredictions retorna dois trens ordenados e completos', async () => {
  const line = transportLines.find((item) => item.id === 'train-9')
  const predictions = await getTrainPredictions(line, 'Pinheiros', new Date('2026-11-19T08:00:30-03:00'))

  assert.equal(predictions.length, 2)
  assert.ok(predictions[0].minutesUntilArrival > 0)
  assert.ok(predictions[1].minutesUntilArrival > predictions[0].minutesUntilArrival)
  assert.match(predictions[0].arrivalTime, /^\d{2}:\d{2}$/)
  assert.ok(['low', 'moderate', 'high', 'full'].includes(predictions[0].crowding.key))
  assert.ok(predictions.every((prediction) => prediction.crowding.label))
})

test('getTrainPredictions rejeita estação que não pertence à linha', async () => {
  const line = transportLines.find((item) => item.id === 'metro-1')
  await assert.rejects(() => getTrainPredictions(line, 'Estação inexistente'), /Estação não encontrada/)
})

test('getTrainPredictions atende as estações inicial e final de todas as linhas', async () => {
  const referenceTime = new Date('2026-11-19T18:15:00-03:00')

  for (const line of transportLines) {
    for (const station of [line.stops[0], line.stops.at(-1)]) {
      const predictions = await getTrainPredictions(line, station, referenceTime)
      assert.equal(predictions.length, 2)
      assert.ok(predictions.every((prediction) => Number.isFinite(prediction.minutesUntilArrival)))
      assert.ok(predictions.every((prediction) => prediction.arrivalTime && prediction.crowding?.label))
    }
  }
})
