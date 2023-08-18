import { partition as basePartition } from 'ramda'

/**
 * @callback partitionFn
 * @template A
 * @param {A} val
 * @returns {*}
 */

/**
 * @function
 * @template A
 * @param {partitionFn} fn
 * @param {A} arr
 * @returns {[A, A]}
 */
export function partition(fn, arr) {
  return basePartition(fn, arr)
}
