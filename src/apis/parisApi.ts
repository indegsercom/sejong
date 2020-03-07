import axios from 'axios'

const baseUrl = 'https://paris-edge.now.sh'

interface ResizeOptions {
  width?: number
  height?: number
}

const parisApi = {
  resize: async (url, options: ResizeOptions) => {
    try {
      const { data } = await axios.post(baseUrl + '/api/resize', {
        image: url,
        ...options,
      })

      return data.location
    } catch (err) {
      console.log(err.message)
      return null
    }
  },
}

export default parisApi
