import axios from 'axios'

const baseUrl = 'https://paris-edge.now.sh'

interface ResizeOptions {
  width?: number
  height?: number
}

const parisApi = {
  resize: async (url, options: ResizeOptions) => {
    const { data } = await axios.post(baseUrl + '/api/resize', {
      image: url,
      ...options,
    })

    return data.location
  },
}

export default parisApi
