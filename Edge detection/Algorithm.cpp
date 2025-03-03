#include <AlgorithmHeader.h>
#include <fstream>

void AlgorithmBmp(String path_in, String path_out){
    // ------------------------ READING FROM FILE ------------------------ //
    std::ifstream fIn;
	fIn.open(path_in.c_str(), std::ios::in | std::ios::binary);
    // BMP FILE CHARACTERISTICS
    const int fh_SIZE = 14; // file header size
    const int ih_SIZE = 40; // information header size

    unsigned char file_header[fh_SIZE];
    unsigned char info_header[ih_SIZE];

    fIn.read(reinterpret_cast<char*> (file_header), fh_SIZE);
    fIn.read(reinterpret_cast<char*> (info_header), ih_SIZE);

    const int img_WIDTH = info_header[4] + (info_header[5] << 8) + (info_header[6] << 16) + (info_header[7] << 24);
    const int img_HEIGHT = info_header[8] + (info_header[9] << 8) + (info_header[10] << 16) + (info_header[11] << 24);
    const int pxls_SIZE = img_WIDTH * img_HEIGHT;

    float *gray_pixels = new float[pxls_SIZE];

    unsigned char Padding[3] = { 0, 0, 0 };
    const int pad_SIZE = (4 - (img_WIDTH * 3) % 4) % 4;
    float gray_sum = 0.0f;

    for (int y = 0; y < img_HEIGHT; y++)
    {
        for (int x = 0; x < img_WIDTH; x++)
        {
            unsigned char color[3];
            fIn.read(reinterpret_cast<char*>(color), 3);

            // CONVERTING TO GRAYSCALE
			/*float gr_val = (static_cast<float>(color[0]) +
                static_cast<float>(color[1]) +
				static_cast<float>(color[2])) / 3.0f;  */
                float gr_val = 0.114*static_cast<float>(color[0]) +
               0.587*static_cast<float>(color[1]) +
               0.299*static_cast<float>(color[2]);

            gray_pixels[y * img_WIDTH + x] = gr_val;
            gray_sum += gr_val;
        }
        fIn.ignore(pad_SIZE);
    }

    fIn.close();

    // ------------------------ WRITING TO FILE ------------------------ //

    std::ofstream fOut;
    fOut.open(path_out.c_str(), std::ios::out | std::ios::binary);

    // KEEPING THE SAME HEADER INFORMATION
    fOut.write(reinterpret_cast<char*> (file_header), fh_SIZE);
    fOut.write(reinterpret_cast<char*> (info_header), ih_SIZE);

    // ------------------------ EDGE DETECTION AND WRITING PIXELS TO FILE ------------------------ //
    // THRESHOLD VALUE
    const float threshold = gray_sum/pxls_SIZE /3;

    // SOBEL HORIZONTAL OPERATOR
    const float hor_kernel[] =
    {
        -1.0f, 0.0f, 1.0f,
        -2.0f, 0.0f, 2.0f,
        -1.0f, 0.0f, 1.0f,
    };

    // SOBEL VERTICAL OPERATOR
    const float ver_kernel[] =
    {
        -1.0f, -2.0f, -1.0f,
        0.0f, 0.0f, 0.0f,
        1.0f, 2.0f, 1.0f,
    };

    for (int i = 0; i < img_HEIGHT; i++)
    {
        for (int j = 0; j < img_WIDTH; j++)
        {
            float sobelH = 0.0f;
            float sobelW = 0.0f;

            for (int n = -1; n < 2; n++)
                for (int m = -1; m < 2; m++)
                {
                    int index = (i + n) * img_WIDTH + j + m;
                    if (index >= 0 && index < pxls_SIZE)
                    {
                        sobelH += gray_pixels[index] * ver_kernel[(m + 1) * 3 + (n + 1)];
                        sobelW += gray_pixels[index] * hor_kernel[(m + 1) * 3 + (n + 1)];
                    }
                }

            float val = std::sqrt(sobelH * sobelH + sobelW * sobelW);

            if (val > 255.0f)
                val = 255.0f;

            if (val < threshold)
                val = 0.0f;

            unsigned char u = static_cast<unsigned char> (val);
            unsigned char color[] = { u, u, u };
            fOut.write(reinterpret_cast<char*> (color), 3);
        }
        fOut.write(reinterpret_cast<char*> (Padding), pad_SIZE);
    }
	fOut.close();
}



